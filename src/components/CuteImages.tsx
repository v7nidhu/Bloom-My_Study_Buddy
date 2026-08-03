import React from 'react';

interface CuteImageProps {
  className?: string;
  size?: number;
}

// 1. Cute Cat on Books Sticker
export const CuteCatBooks: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Stack of Books */}
    {/* Bottom Book (Lavender) */}
    <rect x="20" y="85" width="80" height="15" rx="4" fill="#D6C7FF" stroke="#5D4B8E" strokeWidth="2.5" />
    <path d="M90 85H100V100H90V85Z" fill="#B39EFF" stroke="#5D4B8E" strokeWidth="2.5" />
    <line x1="26" y1="92" x2="60" y2="92" stroke="#5D4B8E" strokeWidth="2" strokeLinecap="round" />
    
    {/* Middle Book (Mint Green) */}
    <rect x="25" y="70" width="70" height="15" rx="4" fill="#C1F0DB" stroke="#3A785A" strokeWidth="2.5" />
    <path d="M85 70H95V85H85V70Z" fill="#93E4BF" stroke="#3A785A" strokeWidth="2.5" />
    <line x1="31" y1="77" x2="65" y2="77" stroke="#3A785A" strokeWidth="2" strokeLinecap="round" />

    {/* Top Book (Pink) */}
    <rect x="30" y="55" width="60" height="15" rx="4" fill="#FBCFE8" stroke="#9D174D" strokeWidth="2.5" />
    <path d="M80 55H90V70H80V55Z" fill="#F472B6" stroke="#9D174D" strokeWidth="2.5" />
    <line x1="36" y1="62" x2="60" y2="62" stroke="#9D174D" strokeWidth="2" strokeLinecap="round" />

    {/* Sleeping Cat */}
    <path d="M40 55C40 45 45 38 55 38C65 38 70 45 70 55H40Z" fill="#FFF" stroke="#374151" strokeWidth="2.5" />
    {/* Cat Ears */}
    <path d="M42 39L38 28L48 35" fill="#FFF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M41 37L39 30L45 35" fill="#FBCFE8" />
    <path d="M68 39L72 28L62 35" fill="#FFF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M69 37L71 30L65 35" fill="#FBCFE8" />
    
    {/* Cat Sleeping Face */}
    <path d="M46 47C47 48 48 48 49 47" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <path d="M61 47C62 48 63 48 64 47" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 50L56 50" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    {/* Cat Blushing */}
    <circle cx="44" cy="51" r="2.5" fill="#F472B6" opacity="0.6" />
    <circle cx="66" cy="51" r="2.5" fill="#F472B6" opacity="0.6" />

    {/* Cat Tail */}
    <path d="M70 52C75 52 82 48 80 40C78 35 73 38 74 44" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Zzz sparkles */}
    <text x="82" y="32" fill="#DB2777" fontSize="11" fontWeight="bold" fontFamily="monospace">Z</text>
    <text x="91" y="23" fill="#EC4899" fontSize="9" fontWeight="bold" fontFamily="monospace">z</text>
  </svg>
);

// 2. Cute Panda Coding Sticker
export const CutePandaCoding: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Panda Head */}
    <circle cx="60" cy="65" r="32" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2.5" />
    
    {/* Panda Ears */}
    <circle cx="33" cy="40" r="11" fill="#1F2937" stroke="#1F2937" strokeWidth="1" />
    <circle cx="33" cy="40" r="6" fill="#FBCFE8" />
    <circle cx="87" cy="40" r="11" fill="#1F2937" stroke="#1F2937" strokeWidth="1" />
    <circle cx="87" cy="40" r="6" fill="#FBCFE8" />

    {/* Panda Eyes Patches */}
    <ellipse cx="46" cy="63" rx="8" ry="11" transform="rotate(-15 46 63)" fill="#1F2937" />
    <ellipse cx="74" cy="63" rx="8" ry="11" transform="rotate(15 74 63)" fill="#1F2937" />
    
    {/* Panda Eyes Pupils */}
    <circle cx="48" cy="61" r="2.5" fill="#FFFFFF" />
    <circle cx="72" cy="61" r="2.5" fill="#FFFFFF" />
    
    {/* Blushing */}
    <circle cx="38" cy="74" r="3" fill="#F472B6" opacity="0.7" />
    <circle cx="82" cy="74" r="3" fill="#F472B6" opacity="0.7" />

    {/* Nose and Mouth */}
    <polygon points="58,69 62,69 60,72" fill="#1F2937" />
    <path d="M57 75C58 76 60 76 60 75C60 76 62 76 63 75" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />

    {/* Tiny Laptop */}
    <rect x="42" y="80" width="36" height="22" rx="4" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" />
    <line x1="42" y1="96" x2="78" y2="96" stroke="#DB2777" strokeWidth="2" />
    {/* Laptop screen heart */}
    <path d="M60 87C60 87 58.5 85 57 85C55.5 85 54.5 86 54.5 87.5C54.5 89.5 60 92 60 92C60 92 65.5 89.5 65.5 87.5C65.5 86 64.5 85 63 85C61.5 85 60 87 60 87Z" fill="#F472B6" />

    {/* Sparkle details */}
    <path d="M100 60L102 65L107 67L102 69L100 74L98 69L93 67L98 65L100 60Z" fill="#FCD34D" />
  </svg>
);

// 3. Cute Study Bear Sticker
export const CuteStudyBear: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Bear Ears */}
    <circle cx="38" cy="42" r="12" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
    <circle cx="38" cy="42" r="6" fill="#FBCFE8" />
    <circle cx="82" cy="42" r="12" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
    <circle cx="82" cy="42" r="6" fill="#FBCFE8" />

    {/* Bear Head */}
    <circle cx="60" cy="65" r="32" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />

    {/* Bear Snout */}
    <ellipse cx="60" cy="74" rx="10" ry="7" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
    <circle cx="60" cy="71" r="3" fill="#78350F" />
    <path d="M60 74V77" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Bear Eyes (Cute winking or happy) */}
    {/* Left Eye: Happy Arc */}
    <path d="M44 65C45 62 48 62 49 65" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Right Eye: Happy Arc */}
    <path d="M71 65C72 62 75 62 76 65" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Spectacles */}
    <circle cx="47" cy="64" r="8" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
    <circle cx="73" cy="64" r="8" stroke="#4F46E5" strokeWidth="2.5" fill="none" />
    <line x1="55" y1="64" x2="65" y2="64" stroke="#4F46E5" strokeWidth="2.5" />

    {/* Blushing */}
    <circle cx="39" cy="73" r="3.5" fill="#F472B6" opacity="0.8" />
    <circle cx="81" cy="73" r="3.5" fill="#F472B6" opacity="0.8" />

    {/* Book Bear is Reading */}
    <path d="M40 92C45 88 55 88 60 92C65 88 75 88 80 92V105C75 101 65 101 60 105C55 101 45 101 40 105V92Z" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2.5" />
    <line x1="60" y1="93" x2="60" y2="105" stroke="#BE185D" strokeWidth="2" />
    <line x1="45" y1="96" x2="54" y2="96" stroke="#F472B6" strokeWidth="1.5" />
    <line x1="45" y1="100" x2="52" y2="100" stroke="#F472B6" strokeWidth="1.5" />
    <line x1="66" y1="96" x2="75" y2="96" stroke="#F472B6" strokeWidth="1.5" />
    <line x1="66" y1="100" x2="73" y2="100" stroke="#F472B6" strokeWidth="1.5" />

    {/* Little Sprout on Head */}
    <path d="M60 33V25" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 27C57 26 55 28 55 30C55 31 58 31 60 28" fill="#10B981" />
    <path d="M60 27C63 26 65 28 65 30C65 31 62 31 60 28" fill="#10B981" />
  </svg>
);

// 4. Cute Coffee / Tea Mug Sticker
export const CuteCoffeeMug: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Steam lines */}
    <path d="M48 24C48 20 52 18 50 12" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M60 24C60 18 64 16 62 10" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M72 24C72 20 76 18 74 12" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Handle of Mug */}
    <path d="M82 50C95 50 95 74 82 74" stroke="#F43F5E" strokeWidth="6" strokeLinecap="round" />
    <path d="M82 50C95 50 95 74 82 74" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />

    {/* Mug Body */}
    <rect x="34" y="36" width="50" height="52" rx="14" fill="#FECDD3" stroke="#F43F5E" strokeWidth="3" />
    <rect x="38" y="40" width="42" height="44" rx="10" fill="#FFF1F2" />

    {/* Cute Happy Face */}
    <circle cx="48" cy="56" r="2.5" fill="#4C0519" />
    <circle cx="70" cy="56" r="2.5" fill="#4C0519" />
    <path d="M56 61C56 64 62 64 62 61" stroke="#4C0519" strokeWidth="2.5" strokeLinecap="round" />

    {/* Cute Heart in Center of Mug */}
    <path d="M59 74C59 74 57.5 72 56 72C54.5 72 53.5 73 53.5 74.5C53.5 76.5 59 79 59 79C59 79 64.5 76.5 64.5 74.5C64.5 73 63.5 72 62 72C60.5 72 59 74 59 74Z" fill="#F43F5E" />

    {/* Cheeks Blushing */}
    <circle cx="43" cy="60" r="2" fill="#FDA4AF" />
    <circle cx="75" cy="60" r="2" fill="#FDA4AF" />
  </svg>
);

// 5. Cute Magic Star Sticker (Success / Achievements)
export const CuteMagicStar: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Glowing background circles */}
    <circle cx="60" cy="60" r="42" fill="#FEF3C7" opacity="0.5" />
    
    {/* Star shape with nice borders */}
    <path
      d="M60 14L74.5 44L107.5 48.5L83.5 71.5L89 104L60 88.5L31 104L36.5 71.5L12.5 48.5L45.5 44L60 14Z"
      fill="#FCD34D"
      stroke="#D97706"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Highlight sheen */}
    <path
      d="M60 18L72.5 45L102 49L80 70"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Cute Star Face */}
    {/* Left Eye (Sparkling) */}
    <path d="M46 56L49 59M49 56L46 59" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    {/* Right Eye (Happy Arc) */}
    <path d="M68 56C69 54 72 54 73 56" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Smiling mouth */}
    <path d="M57 65C57 68 61 68 61 65" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Blushing */}
    <circle cx="43" cy="63" r="3.5" fill="#EF4444" opacity="0.5" />
    <circle cx="74" cy="63" r="3.5" fill="#EF4444" opacity="0.5" />

    {/* Magic dust sparkles */}
    <circle cx="22" cy="22" r="3" fill="#FBBF24" />
    <circle cx="98" cy="28" r="4" fill="#FBBF24" />
    <circle cx="94" cy="88" r="2.5" fill="#FBBF24" />
    <circle cx="28" cy="85" r="3.5" fill="#FBBF24" />
  </svg>
);

// 6. Cute Goal Bullseye / Target Sticker
export const CuteGoalBullseye: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Target rings */}
    <circle cx="60" cy="60" r="45" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="3" />
    <circle cx="60" cy="60" r="30" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2.5" />
    <circle cx="60" cy="60" r="16" fill="#FECDD3" stroke="#F43F5E" strokeWidth="2.5" />

    {/* Arrow */}
    <path d="M85 35L52 68" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
    {/* Arrow feathers */}
    <path d="M82 31L91 26L89 38L82 31Z" fill="#10B981" />
    <path d="M85 35L90 40M82 32L86 36" stroke="#10B981" strokeWidth="2" />
    {/* Arrow tip inside bullseye */}
    <circle cx="52" cy="68" r="3.5" fill="#047857" />

    {/* Cute Target Face */}
    <circle cx="54" cy="58" r="2" fill="#9F1239" />
    <circle cx="66" cy="58" r="2" fill="#9F1239" />
    <path d="M58 63C58 64.5 62 64.5 62 63" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Blush */}
    <circle cx="50" cy="60" r="1.5" fill="#F43F5E" opacity="0.7" />
    <circle cx="70" cy="60" r="1.5" fill="#F43F5E" opacity="0.7" />

    {/* Stars */}
    <path d="M96 74L98 77L101 78L98 79L96 82L94 79L91 78L94 77L96 74Z" fill="#F59E0B" />
  </svg>
);

// 7. Cute Pencil / Stationery Sticker
export const CutePencilHappy: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Pencil body rotated */}
    <g transform="rotate(25 60 60)">
      {/* Eraser */}
      <rect x="48" y="18" width="24" height="15" rx="5" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2.5" />
      <rect x="48" y="28" width="24" height="6" fill="#D1D5DB" stroke="#374151" strokeWidth="2.5" />
      
      {/* Wooden Hex Body */}
      <rect x="48" y="34" width="24" height="46" fill="#FCD34D" stroke="#D97706" strokeWidth="2.5" />
      <line x1="56" y1="34" x2="56" y2="80" stroke="#D97706" strokeWidth="2" />
      <line x1="64" y1="34" x2="64" y2="80" stroke="#D97706" strokeWidth="2" />

      {/* Sharpened wooden collar */}
      <polygon points="48,80 72,80 60,98" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Graphite Tip */}
      <polygon points="56,88 64,88 60,98" fill="#374151" stroke="#374151" strokeWidth="1" />

      {/* Happy face on pencil */}
      <circle cx="54" cy="54" r="2" fill="#78350F" />
      <circle cx="66" cy="54" r="2" fill="#78350F" />
      <path d="M58 59C58 60.5 62 60.5 62 59" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="51" cy="56" r="1.5" fill="#FDA4AF" />
      <circle cx="69" cy="56" r="1.5" fill="#FDA4AF" />
    </g>

    {/* Sparkles around tip */}
    <path d="M92 90L94 93L97 94L94 95L92 98L90 95L87 94L90 93L92 90Z" fill="#38BDF8" />
  </svg>
);

// 8. Cute Smart Owl Sticker (Study Goals / Extra Skills)
export const CuteOwlSmart: React.FC<CuteImageProps> = ({ className = '', size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    {/* Graduation Cap */}
    <polygon points="60,12 85,22 60,32 35,22" fill="#374151" stroke="#111827" strokeWidth="2.5" strokeLinejoin="round" />
    <rect x="52" y="28" width="16" height="10" fill="#374151" stroke="#111827" strokeWidth="2" />
    <path d="M85 22V38C85 41 81 40 81 38" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Owl Body */}
    <ellipse cx="60" cy="72" rx="30" ry="34" fill="#C084FC" stroke="#6B21A8" strokeWidth="2.5" />
    
    {/* Owl Chest (White feather layer) */}
    <ellipse cx="60" cy="78" rx="18" ry="18" fill="#F3E8FF" stroke="#6B21A8" strokeWidth="1.5" />
    <path d="M54 75L57 78L60 75" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M60 75L63 78L66 75" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Big Eyes */}
    <circle cx="45" cy="58" r="11" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="2" />
    <circle cx="45" cy="58" r="5" fill="#1F2937" />
    <circle cx="43" cy="56" r="2" fill="#FFFFFF" />

    <circle cx="75" cy="58" r="11" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="2" />
    <circle cx="75" cy="58" r="5" fill="#1F2937" />
    <circle cx="73" cy="56" r="2" fill="#FFFFFF" />

    {/* Spectacles rim */}
    <circle cx="45" cy="58" r="11" stroke="#D97706" strokeWidth="2.5" fill="none" />
    <circle cx="75" cy="58" r="11" stroke="#D97706" strokeWidth="2.5" fill="none" />
    <line x1="56" y1="58" x2="64" y2="58" stroke="#D97706" strokeWidth="2.5" />

    {/* Beak */}
    <polygon points="57,64 63,64 60,70" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />

    {/* Blush */}
    <circle cx="34" cy="67" r="2" fill="#F472B6" />
    <circle cx="86" cy="67" r="2" fill="#F472B6" />

    {/* Wings */}
    <path d="M30 65C22 65 24 82 32 80" stroke="#6B21A8" strokeWidth="2.5" fill="#C084FC" strokeLinecap="round" />
    <path d="M90 65C98 65 96 82 88 80" stroke="#6B21A8" strokeWidth="2.5" fill="#C084FC" strokeLinecap="round" />

    {/* Feet */}
    <circle cx="48" cy="104" r="3.5" fill="#F59E0B" />
    <circle cx="72" cy="104" r="3.5" fill="#F59E0B" />
  </svg>
);
