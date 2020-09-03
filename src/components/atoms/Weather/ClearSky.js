import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/clear-sky.svg';

function ClearSky() {
  const iconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.set(iconRef.current, { scale: 2.25 });
    tl.to(iconRef.current, { rotate: 360, duration: 24, repeat: -1, ease: 'linear' });
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default ClearSky;
