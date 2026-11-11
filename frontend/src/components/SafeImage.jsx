import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#EEF2F7"/>
      <g fill="#94A3B8" font-family="Arial, sans-serif">
        <circle cx="200" cy="150" r="38" fill="#CBD5E1"/>
        <rect x="140" y="210" width="120" height="90" rx="10" fill="#CBD5E1"/>
        <text x="200" y="335" font-size="16" text-anchor="middle">
          Image unavailable
        </text>
      </g>
    </svg>
  `);

const SafeImage = ({
  src,
  alt = "",
  className = "",
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  const imageSrc =
    typeof src === "string" && src.trim() && !failed
      ? src
      : FALLBACK;

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
};

export default SafeImage;