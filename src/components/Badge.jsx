"use client";
import "./Badge.css";

export default function Badge({ 
  children, 
  variant = "primary",
  size = "medium",
  className = ""
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}
