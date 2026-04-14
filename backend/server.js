import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 8000;
const CACHE_TTL = 3600; // 1 hour
const CACHE_CHECK_PERIOD = 600; // 10 minutes

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize services
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Initialize NodeCache for conversation storage
const conversationCache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CACHE_CHECK_PERIOD,
  useClones: false,
});

// Cache event handlers
conversationCache.on("expired", (key) => {
  console.log(`🗑️ Cache expired: ${key}`);
});

conversationCache.on("del", (key) => {
  console.log(`🗑️ Cache deleted: ${key}`);
});

// System prompt for AI assistant
const SYSTEM_PROMPT = `You are a helpful, knowledgeable AI assistant with extensive programming knowledge. Be conversational, friendly, and natural in your responses.

IMPORTANT - You have access to web search but should RARELY use it. ONLY use web search for CURRENT, REAL-TIME information that changes frequently:

DO NOT use web search for:
- Programming questions, code examples, or tutorials
- Basic concepts, definitions, or explanations
- Mathematical calculations or algorithms  
- General knowledge questions (like locations of cities, historical facts)
- Geographic information (countries, states, cities locations)
- Historical information or established facts
- How-to guides or instructions
- Any information you can provide from your training data

ONLY use web search for CURRENT, REAL-TIME information such as:
- Current weather conditions ("What's the weather RIGHT NOW in Delhi?")
- Live stock/crypto prices ("Current Bitcoin price")
- Breaking news from today ("Latest news about...")
- Current sports scores or live results
- Real-time data that changes by the minute/hour

For questions like "Where is Hajipur in India?" or "What is the capital of France?" - provide the answer directly from your knowledge WITHOUT using web search.

When responding:
- Answer questions using your existing knowledge first
- Be helpful and provide complete, well-formatted responses  
- For code questions, provide working examples with explanations
- Use markdown formatting for better readability
- Don't mention tools unless directly asked`;

// Utility functions
function generateSessionId() {
  return `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

function getConversation(sessionId) {
  if (!sessionId || !conversationCache.has(sessionId)) {
    const newSessionId = sessionId || generateSessionId();
    const newConversation = {
      messages: [{ role: "system", content: SYSTEM_PROMPT }],
      lastActivity: Date.now(),
    };

    conversationCache.set(newSessionId, newConversation);
    return { sessionId: newSessionId, conversation: newConversation };
  }

  const conversation = conversationCache.get(sessionId);
  conversation.lastActivity = Date.now();
  conversationCache.set(sessionId, conversation);

  return { sessionId, conversation };
}

// Tool definitions for web search
const tools = [
  {
    type: "function",
    function: {
      name: "web_search",
      description: "Search the web for CURRENT, REAL-TIME information only. Use this tool ONLY when you need live data that changes frequently, such as: current weather conditions (today's actual weather), live stock/crypto prices, breaking news from the last few days, current sports scores. Do NOT use for general knowledge, historical data, or information you can provide from training data.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Specific search query for current/real-time information",
          },
        },
        required: ["query"],
      },
    },
  },
];

// Web search function
async function webSearch(query) {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    const response = await tavilyClient.search(query, {
      searchDepth: "basic",
      maxResults: 3,
    });

    const results = response.results
      .map((result) => `${result.title}: ${result.content}`)
      .join("\n\n");

    console.log(`✅ Search results found for: "${query}"`);
    return results;
  } catch (error) {
    console.error("❌ Search error:", error.message);
    throw new Error("Web search failed");
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "BaatChit AI Backend is running!",
    timestamp: new Date().toISOString(),
    features: ["AI Chat", "Conversation Memory", "Web Search", "NodeCache"],
    activeConversations: conversationCache.keys().length,
    cacheStats: conversationCache.getStats(),
  });
});

// Main chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        status: "error",
        error: "Message is required",
      });
    }

    console.log("📨 User:", message);

    // Get or create conversation
    const { sessionId: currentSessionId, conversation } = getConversation(sessionId);

    // Add user message to conversation history
    conversation.messages.push({ role: "user", content: message });

    let finalResponse = "";
    let toolUsed = false;

    const MAX_TRIES = 10;
    let count = 0;

    // Chat completion loop for tool calling
    while (true) {
        if(count >= MAX_TRIES) {
          console.error("❌ Max tries reached for tool calling loop");
          finalResponse = "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
          break;
        }
        count++;
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: conversation.messages,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.7,
          max_tokens: 1000,
        });

        const responseMessage = completion.choices[0].message;
        const toolCalls = responseMessage.tool_calls;

        // Add assistant response to conversation history
        conversation.messages.push(responseMessage);

        // Check if tools were called
        if (!toolCalls || toolCalls.length === 0) {
          finalResponse = responseMessage.content;
          break;
        }

        // Process tool calls
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === "web_search") {
            toolUsed = true;
            try {
              const functionArgs = JSON.parse(toolCall.function.arguments);
              console.log(`🔍 Web search requested for: "${functionArgs.query}"`);

              const searchResults = await webSearch(functionArgs.query);

              // Add tool result to conversation history
              conversation.messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: "web_search",
                content: searchResults,
              });
            } catch (error) {
              console.error("🔧 Tool error:", error.message);
              // Add fallback message
              conversation.messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: "web_search",
                content: "Search is currently unavailable. I'll provide an answer based on my existing knowledge instead.",
              });
            }
          }
        }
      } catch (error) {
        // For function calling errors, try without tools first
        console.error("🔧 Function calling error, trying without tools:", error.message);

        try {
          // Remove the last assistant message that caused the error
          if (conversation.messages[conversation.messages.length - 1]?.role === "assistant") {
            conversation.messages.pop();
          }

          const fallbackCompletion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant", 
            messages: conversation.messages,
            temperature: 0.7,
            max_tokens: 1000,
            // No tools for fallback
          });

          finalResponse = fallbackCompletion.choices[0].message.content;
          conversation.messages.push(fallbackCompletion.choices[0].message);
          console.log("✅ Fallback successful without tools");
          break;
        } catch (fallbackError) {
          console.error("❌ Fallback also failed:", fallbackError.message);
          throw new Error("AI service temporarily unavailable");
        }
      }
    }

    // Update conversation in cache
    conversationCache.set(currentSessionId, conversation);

    const responseData = {
      status: "success",
      message: finalResponse,
      sessionId: currentSessionId,
      conversationLength: conversation.messages.length - 1, // Exclude system message
    };

    if (toolUsed) {
      responseData.toolsUsed = ["web_search"];
      console.log("🔧 Tools used: web_search");
    }

    console.log(`🤖 AI (Session: ${currentSessionId.slice(-6)}):`, finalResponse.substring(0, 100) + "...");
    res.json(responseData);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      status: "error",
      error: "Something went wrong. Please try again.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ BaatChit AI Backend running on http://localhost:${PORT}`);

});
