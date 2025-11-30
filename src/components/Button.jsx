"use client";
import "./Button.css";

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "medium",
  disabled = false,
  icon = null,
  className = ""
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
}
