import React from 'react'

const RobotIcon = ({ className = "w-6 h-6", color = "white" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      className={className}
      fill="none"
    >
      {/* Robot head */}
      <rect x="10" y="10" width="12" height="10" rx="2" fill={color} opacity="0.9"/>
      
      {/* Eyes */}
      <circle cx="13" cy="14" r="1.5" fill="#10b981"/>
      <circle cx="19" cy="14" r="1.5" fill="#10b981"/>
      
      {/* Mouth */}
      <rect x="14" y="17" width="4" height="1" rx="0.5" fill="#10b981"/>
      
      {/* Antennas */}
      <circle cx="12" cy="8" r="1" fill={color} opacity="0.8"/>
      <circle cx="20" cy="8" r="1" fill={color} opacity="0.8"/>
      <line x1="12" y1="9" x2="12" y2="10" stroke={color} strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="9" x2="20" y2="10" stroke={color} strokeWidth="1" opacity="0.8"/>
    </svg>
  )
}

export default RobotIcon