import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string | React.ReactNode }> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-md border-b-4 border-neko-cream hover:border-neko-blue transition-colors duration-300 ${className}`}>
      {title && <div className="mb-3 font-bold text-lg text-gray-700 flex items-center gap-2">{title}</div>}
      {children}
    </div>
  );
};