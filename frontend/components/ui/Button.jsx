import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false 
}) => {
  const baseStyles = 'px-3 py-1 font-bold rounded-8 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-neo hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-light',
    danger: 'bg-negative text-white hover:bg-red-500',
    outline: 'bg-transparent text-black hover:bg-slate-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
