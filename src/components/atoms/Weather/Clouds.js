import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/clouds.svg';

function Clouds() {
  const iconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    const cloud = iconRef.current.getElementById('cloud');

    tl.set(iconRef.current, { scale: 1.3 });
    tl.to(cloud, {
      duration: 5,
      ease: 'linear',
      x: 13,
      repeat: -1,
      repeatDelay: 5,
    }).to(cloud, {
      duration: 5,
      ease: 'linear',
      x: 0,
      repeat: -1,
      repeatDelay: 5,
    });
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default Clouds;
