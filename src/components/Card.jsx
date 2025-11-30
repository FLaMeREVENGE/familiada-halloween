"use client";
import "./Card.css";

export default function Card({ 
  children, 
  variant = "default",
  onClick = null,
  className = "",
  hoverable = false
}) {
  const isClickable = onClick !== null;
  
  return (
    <div
      className={`card card-${variant} ${isClickable || hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}
