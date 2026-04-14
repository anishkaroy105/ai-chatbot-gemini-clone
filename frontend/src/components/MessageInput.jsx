import React, { useState, useRef } from 'react'
import { HiPaperAirplane } from 'react-icons/hi'

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="glass-effect border-t border-neutral-900/80 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <div className="glass-effect border border-neutral-800/50 rounded-2xl p-4 focus-within:border-blue-500/50 transition-all duration-200 shadow-lg">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full bg-transparent outline-none resize-none text-sm text-white placeholder-neutral-500 max-h-32 leading-relaxed font-medium"
                rows={1}
                disabled={disabled}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`p-4 rounded-2xl text-sm font-medium transition-all duration-200 shadow-lg ${
              !message.trim() || disabled
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white hover:scale-105 active:scale-95'
            }`}
            title={disabled ? 'Please wait...' : 'Send message'}
          >
            {disabled ? (
              <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiPaperAirplane className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput