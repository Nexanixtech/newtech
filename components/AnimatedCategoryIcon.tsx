"use client"

interface AnimatedCategoryIconProps {
  type: "delivery" | "drones" | "3d-printing" | "reception" | "stem-lab" | "humanoid" | "arm-robots"
  isHovered: boolean
}

export default function AnimatedCategoryIcon({ type, isHovered }: AnimatedCategoryIconProps) {
  const iconComponents = {
    delivery: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`delivery-icon ${isHovered ? "animate" : ""}`}>
          {/* Robot base - made larger */}
          <rect x="20" y="40" width="40" height="30" rx="6" fill="#4A90E2" stroke="#2E5C8A" strokeWidth="3" />
          {/* Robot head - made larger */}
          <circle cx="40" cy="30" r="16" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="3" />
          {/* Eyes - made larger */}
          <circle cx="34" cy="26" r="3" fill="#4A90E2" className="eye-left" />
          <circle cx="46" cy="26" r="3" fill="#4A90E2" className="eye-right" />
          {/* Delivery package - made larger */}
          <rect
            x="10"
            y="20"
            width="16"
            height="16"
            rx="3"
            fill="#FF6B35"
            stroke="#D4491F"
            strokeWidth="2"
            className="package"
          />
          <path d="M10 28 L26 28 M18 20 L18 36" stroke="#D4491F" strokeWidth="2" />
          {/* Wheels - made larger */}
          <circle cx="28" cy="68" r="6" fill="#333" className="wheel-left" />
          <circle cx="52" cy="68" r="6" fill="#333" className="wheel-right" />
        </g>
        {/* Keep the same animations */}
        <style jsx>{`
          .delivery-icon.animate .package {
            animation: float 2s ease-in-out infinite;
          }
          .delivery-icon.animate .wheel-left,
          .delivery-icon.animate .wheel-right {
            animation: spin 1s linear infinite;
          }
          .delivery-icon.animate .eye-left,
          .delivery-icon.animate .eye-right {
            animation: blink 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes blink {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0; }
          }
        `}</style>
      </svg>
    ),

    drones: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`drone-icon ${isHovered ? "animate" : ""}`}>
          {/* Drone body - made larger */}
          <ellipse cx="40" cy="40" rx="20" ry="12" fill="#2E5C8A" />
          {/* Propellers - made larger */}
          <circle cx="20" cy="20" r="12" fill="none" stroke="#4A90E2" strokeWidth="3" className="propeller-1" />
          <circle cx="60" cy="20" r="12" fill="none" stroke="#4A90E2" strokeWidth="3" className="propeller-2" />
          <circle cx="20" cy="60" r="12" fill="none" stroke="#4A90E2" strokeWidth="3" className="propeller-3" />
          <circle cx="60" cy="60" r="12" fill="none" stroke="#4A90E2" strokeWidth="3" className="propeller-4" />
          {/* Arms - made thicker */}
          <line x1="28" y1="28" x2="20" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="52" y1="28" x2="60" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="28" y1="52" x2="20" y2="60" stroke="#333" strokeWidth="4" />
          <line x1="52" y1="52" x2="60" y2="60" stroke="#333" strokeWidth="4" />
          {/* Camera - made larger */}
          <circle cx="40" cy="40" r="6" fill="#FF6B35" className="camera" />
        </g>
        {/* Keep the same animations */}
        <style jsx>{`
          .drone-icon.animate {
            animation: hover 3s ease-in-out infinite;
          }
          .drone-icon.animate .propeller-1,
          .drone-icon.animate .propeller-2,
          .drone-icon.animate .propeller-3,
          .drone-icon.animate .propeller-4 {
            animation: spin-fast 0.1s linear infinite;
          }
          .drone-icon.animate .camera {
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes hover {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes spin-fast {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </svg>
    ),

    "3d-printing": (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`printer-icon ${isHovered ? "animate" : ""}`}>
          {/* Printer frame */}
          <rect x="15" y="20" width="50" height="40" rx="4" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Print bed */}
          <rect x="20" y="50" width="40" height="4" fill="#333" />
          {/* Print head */}
          <rect x="30" y="25" width="20" height="8" rx="2" fill="#FF6B35" className="print-head" />
          {/* Printed object */}
          <rect x="35" y="45" width="10" height="5" rx="1" fill="#4A90E2" className="printed-object" />
          {/* Frame details */}
          <line x1="15" y1="30" x2="65" y2="30" stroke="#4A90E2" strokeWidth="1" />
          <line x1="15" y1="45" x2="65" y2="45" stroke="#4A90E2" strokeWidth="1" />
          {/* Filament */}
          <path d="M50 15 Q55 20 50 25" stroke="#FF6B35" strokeWidth="2" fill="none" className="filament" />
        </g>
        <style jsx>{`
          .printer-icon.animate .print-head {
            animation: print-move 3s ease-in-out infinite;
          }
          .printer-icon.animate .printed-object {
            animation: build-up 3s ease-in-out infinite;
          }
          .printer-icon.animate .filament {
            animation: flow 2s ease-in-out infinite;
          }
          @keyframes print-move {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
          }
          @keyframes build-up {
            0% { transform: scaleY(0.2); }
            100% { transform: scaleY(1); }
          }
          @keyframes flow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </svg>
    ),

    reception: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`reception-icon ${isHovered ? "animate" : ""}`}>
          {/* Robot body */}
          <rect x="30" y="35" width="20" height="30" rx="10" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Head */}
          <circle cx="40" cy="25" r="10" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Screen face */}
          <rect x="35" y="20" width="10" height="8" rx="2" fill="#4A90E2" className="screen" />
          {/* Eyes on screen */}
          <circle cx="38" cy="23" r="1" fill="#E8F4FD" className="eye-left" />
          <circle cx="42" cy="23" r="1" fill="#E8F4FD" className="eye-right" />
          {/* Smile */}
          <path d="M37 26 Q40 28 43 26" stroke="#E8F4FD" strokeWidth="1" fill="none" className="smile" />
          {/* Arms */}
          <circle cx="25" cy="45" r="3" fill="#4A90E2" className="hand-left" />
          <circle cx="55" cy="45" r="3" fill="#4A90E2" className="hand-right" />
          <line x1="30" y1="42" x2="25" y2="45" stroke="#4A90E2" strokeWidth="3" />
          <line x1="50" y1="42" x2="55" y2="45" stroke="#4A90E2" strokeWidth="3" />
          {/* Base */}
          <ellipse cx="40" cy="65" rx="12" ry="4" fill="#333" />
        </g>
        <style jsx>{`
          .reception-icon.animate .hand-left {
            animation: wave-left 2s ease-in-out infinite;
          }
          .reception-icon.animate .hand-right {
            animation: wave-right 2s ease-in-out infinite 0.5s;
          }
          .reception-icon.animate .screen {
            animation: screen-glow 3s ease-in-out infinite;
          }
          .reception-icon.animate .smile {
            animation: smile-animate 4s ease-in-out infinite;
          }
          @keyframes wave-left {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes wave-right {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(20deg); }
          }
          @keyframes screen-glow {
            0%, 100% { fill: #4A90E2; }
            50% { fill: #6BB6FF; }
          }
          @keyframes smile-animate {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0.5; }
          }
        `}</style>
      </svg>
    ),

    "stem-lab": (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`stem-icon ${isHovered ? "animate" : ""}`}>
          {/* Lab table */}
          <rect x="15" y="45" width="50" height="20" rx="2" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Beaker */}
          <path d="M25 35 L25 45 L35 45 L35 35 Z" fill="none" stroke="#4A90E2" strokeWidth="2" />
          <path d="M30 35 L30 25" stroke="#4A90E2" strokeWidth="2" />
          <circle cx="30" cy="25" r="2" fill="#FF6B35" className="molecule" />
          {/* Circuit board */}
          <rect x="40" y="35" width="15" height="10" rx="1" fill="#2E5C8A" />
          <circle cx="43" cy="38" r="1" fill="#FF6B35" className="led-1" />
          <circle cx="47" cy="38" r="1" fill="#4A90E2" className="led-2" />
          <circle cx="51" cy="38" r="1" fill="#FF6B35" className="led-3" />
          {/* Microscope */}
          <ellipse cx="60" cy="40" rx="3" ry="8" fill="#333" />
          <circle cx="60" cy="32" r="4" fill="#E8F4FD" stroke="#333" strokeWidth="1" />
          {/* Atoms floating */}
          <circle cx="20" cy="20" r="2" fill="#FF6B35" className="atom-1" />
          <circle cx="60" cy="15" r="2" fill="#4A90E2" className="atom-2" />
          <circle cx="45" cy="18" r="2" fill="#2E5C8A" className="atom-3" />
        </g>
        <style jsx>{`
          .stem-icon.animate .molecule {
            animation: bounce 2s ease-in-out infinite;
          }
          .stem-icon.animate .led-1,
          .stem-icon.animate .led-2,
          .stem-icon.animate .led-3 {
            animation: blink-led 1.5s ease-in-out infinite;
          }
          .stem-icon.animate .led-2 {
            animation-delay: 0.5s;
          }
          .stem-icon.animate .led-3 {
            animation-delay: 1s;
          }
          .stem-icon.animate .atom-1,
          .stem-icon.animate .atom-2,
          .stem-icon.animate .atom-3 {
            animation: orbit 4s linear infinite;
          }
          .stem-icon.animate .atom-2 {
            animation-delay: 1.3s;
          }
          .stem-icon.animate .atom-3 {
            animation-delay: 2.6s;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes blink-led {
            0%, 50% { opacity: 0.3; }
            25%, 75% { opacity: 1; }
          }
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(10px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
          }
        `}</style>
      </svg>
    ),

    humanoid: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`humanoid-icon ${isHovered ? "animate" : ""}`}>
          {/* Head */}
          <circle cx="40" cy="20" r="8" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="37" cy="18" r="1.5" fill="#4A90E2" className="eye-left" />
          <circle cx="43" cy="18" r="1.5" fill="#4A90E2" className="eye-right" />
          {/* Body */}
          <rect x="32" y="28" width="16" height="25" rx="8" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Arms */}
          <rect
            x="20"
            y="32"
            width="12"
            height="6"
            rx="3"
            fill="#E8F4FD"
            stroke="#4A90E2"
            strokeWidth="2"
            className="arm-left"
          />
          <rect
            x="48"
            y="32"
            width="12"
            height="6"
            rx="3"
            fill="#E8F4FD"
            stroke="#4A90E2"
            strokeWidth="2"
            className="arm-right"
          />
          {/* Hands */}
          <circle cx="20" cy="35" r="3" fill="#4A90E2" className="hand-left" />
          <circle cx="60" cy="35" r="3" fill="#4A90E2" className="hand-right" />
          {/* Legs */}
          <rect x="35" y="53" width="5" height="15" rx="2.5" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          <rect x="40" y="53" width="5" height="15" rx="2.5" fill="#E8F4FD" stroke="#4A90E2" strokeWidth="2" />
          {/* Feet */}
          <ellipse cx="37.5" cy="70" rx="4" ry="2" fill="#333" />
          <ellipse cx="42.5" cy="70" rx="4" ry="2" fill="#333" />
          {/* Chest panel */}
          <rect x="36" y="35" width="8" height="8" rx="2" fill="#4A90E2" className="chest-panel" />
        </g>
        <style jsx>{`
          .humanoid-icon.animate .arm-left {
            animation: arm-swing-left 3s ease-in-out infinite;
          }
          .humanoid-icon.animate .arm-right {
            animation: arm-swing-right 3s ease-in-out infinite;
          }
          .humanoid-icon.animate .chest-panel {
            animation: panel-glow 2s ease-in-out infinite;
          }
          .humanoid-icon.animate .eye-left,
          .humanoid-icon.animate .eye-right {
            animation: eye-scan 4s ease-in-out infinite;
          }
          @keyframes arm-swing-left {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-15deg); }
          }
          @keyframes arm-swing-right {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes panel-glow {
            0%, 100% { fill: #4A90E2; }
            50% { fill: #6BB6FF; }
          }
          @keyframes eye-scan {
            0%, 100% { fill: #4A90E2; }
            50% { fill: #FF6B35; }
          }
        `}</style>
      </svg>
    ),

    "arm-robots": (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <g className={`arm-icon ${isHovered ? "animate" : ""}`}>
          {/* Base */}
          <rect x="30" y="60" width="20" height="8" rx="4" fill="#333" />
          {/* First joint */}
          <circle cx="40" cy="60" r="4" fill="#4A90E2" className="joint-1" />
          {/* First arm segment */}
          <rect
            x="38"
            y="45"
            width="4"
            height="15"
            rx="2"
            fill="#E8F4FD"
            stroke="#4A90E2"
            strokeWidth="2"
            className="segment-1"
          />
          {/* Second joint */}
          <circle cx="40" cy="45" r="3" fill="#4A90E2" className="joint-2" />
          {/* Second arm segment */}
          <rect
            x="38"
            y="30"
            width="4"
            height="15"
            rx="2"
            fill="#E8F4FD"
            stroke="#4A90E2"
            strokeWidth="2"
            className="segment-2"
          />
          {/* Third joint */}
          <circle cx="40" cy="30" r="3" fill="#4A90E2" className="joint-3" />
          {/* End effector */}
          <rect x="35" y="25" width="10" height="5" rx="2" fill="#FF6B35" className="end-effector" />
          {/* Gripper fingers */}
          <rect x="33" y="23" width="3" height="2" rx="1" fill="#333" className="finger-1" />
          <rect x="44" y="23" width="3" height="2" rx="1" fill="#333" className="finger-2" />
          {/* Object being held */}
          <circle cx="40" cy="20" r="2" fill="#2E5C8A" className="object" />
        </g>
        <style jsx>{`
          .arm-icon.animate .segment-1 {
            animation: arm-rotate-1 4s ease-in-out infinite;
            transform-origin: 40px 60px;
          }
          .arm-icon.animate .segment-2 {
            animation: arm-rotate-2 4s ease-in-out infinite 0.5s;
            transform-origin: 40px 45px;
          }
          .arm-icon.animate .end-effector {
            animation: gripper-move 3s ease-in-out infinite;
          }
          .arm-icon.animate .finger-1 {
            animation: grip-close 2s ease-in-out infinite;
          }
          .arm-icon.animate .finger-2 {
            animation: grip-close 2s ease-in-out infinite;
          }
          .arm-icon.animate .object {
            animation: object-lift 3s ease-in-out infinite;
          }
          @keyframes arm-rotate-1 {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes arm-rotate-2 {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-10deg); }
          }
          @keyframes gripper-move {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes grip-close {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(0.7); }
          }
          @keyframes object-lift {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      </svg>
    ),
  }

  return iconComponents[type] || null
}
