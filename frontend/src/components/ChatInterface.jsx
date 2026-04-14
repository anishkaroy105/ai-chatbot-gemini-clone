import React, { useState, useRef, useEffect } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import Header from './Header'

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          sessionId: sessionId 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Store session ID if this is a new conversation
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
        console.log('🆔 Session started:', data.sessionId.slice(-6))
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.message || "I'm sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date(),
        toolsUsed: data.toolsUsed || []
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = () => {
    setSessionId(null)
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ])
    console.log('🆕 Started new conversation')
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <Header onNewConversation={startNewConversation} sessionId={sessionId} />
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900/20 via-transparent to-neutral-800/10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />
        
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
        <MessageInput 
          onSendMessage={sendMessage} 
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default ChatInterface