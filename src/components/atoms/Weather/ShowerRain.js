import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/shower-rain.svg';

function ShowerRain() {
  const iconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    const rain = iconRef.current.getElementById('rain');

    tl.set(iconRef.current, { scale: 1.4 }).set(rain, { rotate: 10 });
    tl.fromTo(
      rain.children[0],
      {
        y: -18,
      },
      { y: 15, duration: 1.2, repeat: -1, ease: 'linear' },
    )
      .fromTo(
        rain.children[1],
        {
          y: -18,
        },
        { y: 15, duration: 1.1, repeat: -1, ease: 'linear' },
        '+=0.2',
      )
      .fromTo(
        rain.children[2],
        {
          y: -18,
        },
        { y: 15, duration: 1.3, repeat: -1, ease: 'linear' },
        '+=0.3',
      );
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default ShowerRain;
