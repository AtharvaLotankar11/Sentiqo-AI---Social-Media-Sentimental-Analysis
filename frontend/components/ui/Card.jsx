import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border-2 border-black rounded-8 p-3 shadow-neo ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-2 pb-2 border-b-2 border-slate-100 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
