import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/thunderstorm.svg';

function Thunderstorm() {
  const iconRef = useRef(null);

  useEffect(() => {
    gsap.set(iconRef.current, { scale: 1.3 });
    const tl = gsap.timeline({ repeat: -1, duration: 1, ease: 'linear' });

    const thunder = iconRef.current.getElementById('thunder');
    const cloud = iconRef.current.getElementById('cloud');

    tl.to(thunder, {
      fill: 'white',
      x: -1,
      y: 5,
    }).to(thunder, {
      fill: 'orange',
      x: 0,
      y: 0,
    });

    const cloudTl = gsap.timeline();
    cloudTl
      .to(
        cloud,
        {
          duration: 5,
          ease: 'linear',
          x: 13,
          repeat: -1,
          repeatDelay: 5,
        },
        0,
      )
      .to(
        cloud,
        {
          duration: 5,
          ease: 'linear',
          x: 0,
          repeat: -1,
          repeatDelay: 5,
        },
        5,
      );
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default Thunderstorm;
