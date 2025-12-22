import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-6", color = "#1A1918" }) => {
  return (
    <svg 
      viewBox="0 0 110 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="pinfo"
    >
      <text 
        x="0" 
        y="28" 
        fontFamily="'Noto Sans KR', sans-serif" 
        fontWeight="900" 
        fontSize="34" 
        fill={color} 
        letterSpacing="-1.5"
      >
        pinfo
      </text>
    </svg>
  );
};