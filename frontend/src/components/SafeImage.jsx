import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
      <rect width='100%' height='100%' fill='#EEF2F7'/>
      <g fill='#94A3B8' font-family='sans-serif'>
        <circle cx='200' cy='160' r='38' fill='#CBD5E1'/>
        <rect x='140' y='220' width='120' height='90' rx='10' fill='#CBD5E1'/>
        <text x='200' y='340' font-size='16' text-anchor='middle'>Image unavailable</text>
      </g>
    </svg>`
  );

const SafeImage = ({ src, alt = "", className = "", ...rest }) => {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={!src || failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
};

export default SafeImage;
