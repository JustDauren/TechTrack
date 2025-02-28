import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  hover?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  hover = false,
  border = false,
  ...rest
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm 
        ${!noPadding ? 'p-4' : ''} 
        ${hover ? 'transition-all duration-200 hover:shadow-md' : ''}
        ${border ? 'border border-gray-200' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <h3 className={`font-medium text-lg ${className}`} {...rest}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;