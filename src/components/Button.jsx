import React from "react";

function Button({
  onClick,
  children,
  backgroundColor = "bg-black",
  textColor = "text-white",
  size = "medium",
  className = "",
}) {
  const sizeClasses = {
    small: "h-12 w-28 text-xs",
    medium: "h-16 w-36 text-sm",
    large: "h-20 w-44 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full ${sizeClasses[size]} ${textColor} ${backgroundColor} shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-600 ${className} flex items-center justify-center`}
    >
      {children}
    </button>
  );
}

export default Button;
