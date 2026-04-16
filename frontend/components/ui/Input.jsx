import React from 'react';

const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  className = '',
  id
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-bold text-sm uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-2 py-1 border-2 border-black rounded-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
    </div>
  );
};

export default Input;
