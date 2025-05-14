import React from "react";
import Link from "next/link";
import "./style.css";

interface SideButtonsProps {
  text?: string;
  state?: "default" | "active";
  className?: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const SideButtons = ({
  text = "Dashboard",
  state = "default",
  className,
  icon,
  href,
  onClick,
}: SideButtonsProps) => {
  const content = (
    <div 
      className={`side-buttons ${state === "active" ? "active" : ""} ${className || ""}`}
      onClick={onClick}
    >
      {icon}
      <div className="text-wrapper">{text}</div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}; 