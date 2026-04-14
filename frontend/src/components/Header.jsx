import React from 'react'
import { HiChatAlt2, HiPlus } from 'react-icons/hi'
import { RiRobotFill } from 'react-icons/ri'

const Header = ({ onNewConversation, sessionId }) => {
  return (
    <header className="glass-effect border-b border-neutral-900/80 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <HiChatAlt2 className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full flex items-center justify-center">
              <RiRobotFill className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              BaatChit
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              {sessionId ? (
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Session: ...{sessionId.slice(-6)}</span>
                </span>
              ) : (
                'Premium AI Assistant'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onNewConversation}
            className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 px-4 py-2.5 text-white text-sm font-medium rounded-xl flex items-center space-x-2 hover:scale-105 transition-all duration-200 shadow-lg"
            title="Start new conversation"
          >
            <HiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header