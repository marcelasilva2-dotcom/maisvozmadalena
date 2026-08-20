import React from 'react';

interface VozLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'badge' | 'full' | 'inline' | 'emblem';
}

export const VozLogo: React.FC<VozLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'badge'
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Full SVG with +voz text, speech bubble and wifi icon
  if (variant === 'inline' || variant === 'full') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <svg
          viewBox="0 0 260 110"
          className={size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : size === 'xl' ? 'h-20' : 'h-11'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Speech Bubble White Background */}
          <path
            d="M 28 35 C 28 22, 38 12, 51 12 L 180 12 C 193 12, 203 22, 203 35 L 203 62 C 203 75, 193 85, 180 85 L 68 85 L 42 102 L 48 85 L 51 85 C 38 85, 28 75, 28 62 Z"
            fill="white"
            filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.12))"
          />

          {/* 3D Orange Shadow/Depth for the Wifi Circle */}
          <ellipse
            cx="198"
            cy="36"
            rx="36"
            ry="30"
            fill="#FF8C00"
            transform="rotate(-15 198 36)"
          />

          {/* Green Face for the Wifi Circle */}
          <ellipse
            cx="190"
            cy="32"
            rx="34"
            ry="28"
            fill="#45B649"
            transform="rotate(-15 190 32)"
          />

          {/* Wifi Broadcast Icon (White) */}
          <g transform="translate(187, 30) rotate(-15) translate(-15, -15)">
            {/* Dot */}
            <circle cx="15" cy="22" r="2.2" fill="white" />
            {/* Inner Arc */}
            <path
              d="M 9.5 16.5 A 8 8 0 0 1 20.5 16.5"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Outer Arc */}
            <path
              d="M 5 11.5 A 14 14 0 0 1 25 11.5"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* "+voz" Brand Typography */}
          <g transform="translate(4, 0)">
            {/* Orange Plus '+' */}
            <path
              d="M 12 48 L 20 48 L 20 40 L 27 40 L 27 48 L 35 48 L 35 55 L 27 55 L 27 63 L 20 63 L 20 55 L 12 55 Z"
              fill="#FF8C00"
            />

            {/* Green 'v' */}
            <path
              d="M 40 40 L 48 40 L 55 60 L 62 40 L 70 40 L 59 68 L 51 68 Z"
              fill="#0F8A43"
            />

            {/* Green 'o' */}
            <path
              d="M 85 39 C 93 39, 99 45, 99 54 C 99 63, 93 69, 85 69 C 77 69, 71 63, 71 54 C 71 45, 77 39, 85 39 Z M 85 46 C 81 46, 78 50, 78 54 C 78 58, 81 62, 85 62 C 89 62, 92 58, 92 54 C 92 50, 89 46, 85 46 Z"
              fill="#0F8A43"
            />

            {/* Orange 'z' */}
            <path
              d="M 104 41 L 124 41 L 124 47 L 112 61 L 125 61 L 125 68 L 103 68 L 103 62 L 115 48 L 104 48 Z"
              fill="#FF8C00"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Emblem (Green rounded container with the white speech bubble & logo inside, exact match to the uploaded image)
  if (variant === 'emblem') {
    return (
      <div 
        className={`bg-[#0F8A43] rounded-2xl flex items-center justify-center p-1.5 shadow-md ${sizeMap[size]} ${className}`}
      >
        <svg
          viewBox="0 0 240 220"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Speech Bubble White Background */}
          <path
            d="M 32 80 C 32 62, 46 48, 64 48 L 165 48 C 183 48, 197 62, 197 80 L 197 122 C 197 140, 183 154, 165 154 L 88 154 L 54 180 L 62 154 L 64 154 C 46 154, 32 140, 32 122 Z"
            fill="white"
          />

          {/* 3D Orange Shadow/Depth for the Wifi Circle */}
          <ellipse
            cx="192"
            cy="82"
            rx="46"
            ry="38"
            fill="#FF8C00"
            transform="rotate(-15 192 82)"
          />

          {/* Green Face for the Wifi Circle */}
          <ellipse
            cx="182"
            cy="76"
            rx="44"
            ry="36"
            fill="#45B649"
            transform="rotate(-15 182 76)"
          />

          {/* Wifi Broadcast Icon (White) */}
          <g transform="translate(178, 73) rotate(-15) translate(-19, -19)">
            {/* Dot */}
            <circle cx="19" cy="27" r="3" fill="white" />
            {/* Inner Arc */}
            <path
              d="M 12 20 A 10 10 0 0 1 26 20"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Outer Arc */}
            <path
              d="M 6 13 A 18 18 0 0 1 32 13"
              stroke="white"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* "+voz" Brand Typography */}
          <g transform="translate(6, 42)">
            {/* Orange Plus '+' */}
            <path
              d="M 6 52 L 18 52 L 18 40 L 28 40 L 28 52 L 40 52 L 40 62 L 28 62 L 28 74 L 18 74 L 18 62 L 6 62 Z"
              fill="#FF8C00"
            />

            {/* Green 'v' */}
            <path
              d="M 46 41 L 57 41 L 68 70 L 79 41 L 90 41 L 74 79 L 62 79 Z"
              fill="#0F8A43"
            />

            {/* Green 'o' */}
            <path
              d="M 112 40 C 123 40, 131 49, 131 60 C 131 71, 123 80, 112 80 C 101 80, 93 71, 93 60 C 93 49, 101 40, 112 40 Z M 112 50 C 107 50, 103 54, 103 60 C 103 66, 107 70, 112 70 C 117 70, 121 66, 121 60 C 121 54, 117 50, 112 50 Z"
              fill="#0F8A43"
            />

            {/* Orange 'z' */}
            <path
              d="M 137 42 L 165 42 L 165 50 L 148 70 L 166 70 L 166 80 L 136 80 L 136 72 L 153 52 L 137 52 Z"
              fill="#FF8C00"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Default Badge Variant (Perfect for Navbar icon)
  return (
    <div 
      className={`relative rounded-2xl bg-[#0F8A43] flex items-center justify-center shadow-md p-1.5 transition-transform group-hover:scale-105 ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 240 220"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Speech Bubble White Background */}
        <path
          d="M 32 80 C 32 62, 46 48, 64 48 L 165 48 C 183 48, 197 62, 197 80 L 197 122 C 197 140, 183 154, 165 154 L 88 154 L 54 180 L 62 154 L 64 154 C 46 154, 32 140, 32 122 Z"
          fill="white"
        />

        {/* 3D Orange Shadow/Depth for the Wifi Circle */}
        <ellipse
          cx="192"
          cy="82"
          rx="46"
          ry="38"
          fill="#FF8C00"
          transform="rotate(-15 192 82)"
        />

        {/* Green Face for the Wifi Circle */}
        <ellipse
          cx="182"
          cy="76"
          rx="44"
          ry="36"
          fill="#45B649"
          transform="rotate(-15 182 76)"
        />

        {/* Wifi Broadcast Icon (White) */}
        <g transform="translate(178, 73) rotate(-15) translate(-19, -19)">
          <circle cx="19" cy="27" r="3" fill="white" />
          <path
            d="M 12 20 A 10 10 0 0 1 26 20"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 6 13 A 18 18 0 0 1 32 13"
            stroke="white"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* "+voz" Brand Typography */}
        <g transform="translate(6, 42)">
          {/* Orange Plus '+' */}
          <path
            d="M 6 52 L 18 52 L 18 40 L 28 40 L 28 52 L 40 52 L 40 62 L 28 62 L 28 74 L 18 74 L 18 62 L 6 62 Z"
            fill="#FF8C00"
          />

          {/* Green 'v' */}
          <path
            d="M 46 41 L 57 41 L 68 70 L 79 41 L 90 41 L 74 79 L 62 79 Z"
            fill="#0F8A43"
          />

          {/* Green 'o' */}
          <path
            d="M 112 40 C 123 40, 131 49, 131 60 C 131 71, 123 80, 112 80 C 101 80, 93 71, 93 60 C 93 49, 101 40, 112 40 Z M 112 50 C 107 50, 103 54, 103 60 C 103 66, 107 70, 112 70 C 117 70, 121 66, 121 60 C 121 54, 117 50, 112 50 Z"
            fill="#0F8A43"
          />

          {/* Orange 'z' */}
          <path
            d="M 137 42 L 165 42 L 165 50 L 148 70 L 166 70 L 166 80 L 136 80 L 136 72 L 153 52 L 137 52 Z"
            fill="#FF8C00"
          />
        </g>
      </svg>
    </div>
  );
};
