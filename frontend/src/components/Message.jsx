import React from 'react'
import { HiUser } from 'react-icons/hi'
import { RiRobotFill } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

const Message = ({ message }) => {
  const { text, isUser, timestamp } = message

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-4 max-w-4xl w-full ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
              : 'bg-gradient-to-br from-emerald-500 to-teal-600'
          }`}>
            {isUser ? (
              <HiUser className="w-5 h-5 text-white" />
            ) : (
              <RiRobotFill className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
        
        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          <div className={`px-5 py-4 rounded-2xl shadow-lg max-w-full lg:max-w-3xl break-words ${
            isUser 
              ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-br-lg border border-emerald-500/30' 
              : 'glass-effect text-white rounded-bl-lg border border-neutral-800/50'
          }`}>
            <div className="text-sm leading-relaxed font-medium">
              {isUser ? (
                <div className="whitespace-pre-wrap">{text}</div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({children}) => <h1 className="text-lg font-bold mb-3 text-white">{children}</h1>,
                    h2: ({children}) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                    h3: ({children}) => <h3 className="text-sm font-bold mb-2 text-white">{children}</h3>,
                    p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="text-gray-100">{children}</li>,
                    code: ({inline, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <div className="my-3">
                          <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700">
                            <div className="bg-neutral-800 px-3 py-2 text-xs text-gray-400 border-b border-neutral-700">
                              {match ? match[1] : 'code'}
                            </div>
                            <pre className="p-4 overflow-x-auto text-sm">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <code className="bg-neutral-800 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                          {children}
                        </code>
                      )
                    },
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-3 bg-neutral-800/50 rounded-r-lg">
                        <div className="text-gray-300 italic">{children}</div>
                      </blockquote>
                    ),
                    table: ({children}) => (
                      <div className="overflow-x-auto my-3">
                        <table className="min-w-full border-collapse border border-neutral-700 rounded-lg">{children}</table>
                      </div>
                    ),
                    th: ({children}) => (
                      <th className="border border-neutral-700 px-3 py-2 bg-neutral-800 text-left font-semibold text-gray-200">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="border border-neutral-700 px-3 py-2 text-gray-300">{children}</td>
                    ),
                    strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                    a: ({children, href}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
              )}
            </div>
          </div>
          <div className={`text-xs text-neutral-600 mt-2 px-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {timestamp && new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message