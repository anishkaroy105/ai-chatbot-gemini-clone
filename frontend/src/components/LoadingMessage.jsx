import React from 'react'
import { RiRobotFill } from 'react-icons/ri'

const LoadingMessage = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-4 max-w-4xl w-full">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <RiRobotFill className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Loading animation */}
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="glass-effect border border-neutral-800/50 px-5 py-4 rounded-2xl rounded-bl-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-white font-medium">AI is thinking...</span>
            </div>
          </div>
          <div className="text-xs text-neutral-600 mt-2 px-2 text-left">
            Processing your request
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingMessage