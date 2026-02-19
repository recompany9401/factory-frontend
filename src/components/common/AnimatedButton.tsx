import React from "react";
import "./AnimatedButton.css";

interface AnimatedButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text = "VIEW MORE",
  onClick,
  className = "",
}) => {
  const chars = text.split("");

  return (
    <button className={`rolling-text-btn ${className}`} onClick={onClick}>
      <div>
        {chars.map((char, index) => (
          <span
            key={index}
            style={{
              transitionDelay: `${index * 0.03}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}

        <span
          className="arrow-icon"
          style={{ transitionDelay: `${chars.length * 0.03}s` }}
        >
          →
        </span>
      </div>
    </button>
  );
};

export default AnimatedButton;
