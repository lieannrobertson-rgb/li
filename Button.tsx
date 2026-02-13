import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-neko-orange text-white hover:bg-opacity-90",
    secondary: "bg-neko-pink text-white hover:bg-opacity-90",
    accent: "bg-neko-blue text-white hover:bg-opacity-90",
    outline: "border-2 border-neko-orange text-neko-orange hover:bg-neko-orange hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};