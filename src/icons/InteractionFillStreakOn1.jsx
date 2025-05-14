import React from "react";

export const InteractionFillStreakOn1 = ({ className, color = "#8ECC09" }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 2V4M16 2V4M4 9H20M19 2H5C3.343 2 2 3.343 2 5V19C2 20.657 3.343 22 5 22H19C20.657 22 22 20.657 22 19V5C22 3.343 20.657 2 19 2Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 15L11 17L15 13"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}; 