import React from "react";

export const GamificationFillLeaderboard = ({ className, color = "#828282" }) => {
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
        d="M10 15V19M15 12V19M5 18V19M20 9V19M5 5V5C5 3.895 5 3.343 5.2 2.92C5.374 2.552 5.644 2.282 6.012 2.108C6.435 1.908 6.987 1.908 8.092 1.908H15.908C17.013 1.908 17.565 1.908 17.988 2.108C18.356 2.282 18.626 2.552 18.8 2.92C19 3.343 19 3.895 19 5V5M4 19H20C20.53 19 21.039 19.211 21.414 19.586C21.789 19.961 22 20.47 22 21C22 21.53 21.789 22.039 21.414 22.414C21.039 22.789 20.53 23 20 23H4C3.47 23 2.961 22.789 2.586 22.414C2.211 22.039 2 21.53 2 21C2 20.47 2.211 19.961 2.586 19.586C2.961 19.211 3.47 19 4 19Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}; 