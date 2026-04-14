import React from 'react'
import Message from './Message'
import LoadingMessage from './LoadingMessage'

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
      <div className="max-w-4xl mx-auto space-y-1">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-2xl font-bold text-white">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Welcome to BaatChit</h3>
            <p className="text-neutral-500 max-w-md mx-auto leading-relaxed">
              Your premium AI assistant is ready to help. Ask me anything, and let's start a conversation!
            </p>
          </div>
        )}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  )
}

export default MessageList