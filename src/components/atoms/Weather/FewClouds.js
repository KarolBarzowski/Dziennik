import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/few-clouds.svg';

function FewClouds() {
  const iconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    const sun = iconRef.current.getElementById('sun');

    tl.set(iconRef.current, { scale: 1.6 });
    tl.to(sun, {
      rotate: 360,
      duration: 24,
      repeat: -1,
      ease: 'linear',
      transformOrigin: 'center',
    });
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default FewClouds;
