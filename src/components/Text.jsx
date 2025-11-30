"use client";
import "./Text.css";

export default function Text({ 
  children, 
  variant = "body",
  color = "default",
  align = "left",
  className = ""
}) {
  const Tag = variant === "h1" || variant === "h2" || variant === "h3" ? variant : "p";
  
  return (
    <Tag className={`text text-${variant} text-color-${color} text-align-${align} ${className}`}>
      {children}
    </Tag>
  );
}
