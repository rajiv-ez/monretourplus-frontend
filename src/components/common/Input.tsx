import React from 'react';

interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  readOnly?: boolean;


}

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',

  disabled = false,
  readOnly = false
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="input-with-icon">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={`
          block w-full rounded-md shadow-sm py-2 px-3 
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
          ${(disabled || readOnly) ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          transition-colors duration-200
        `}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};



export default Input;