import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactComponent as Icon } from 'assets/weather/snow.svg';

function Snow() {
  const iconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    const snow = iconRef.current.getElementById('snow');

    const animate = ref => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.fromTo(
        ref,
        {
          opacity: 0,
          x: 2,
          y: -2,
        },
        {
          opacity: 1,
          x: -2,
          y: 2,
          duration: 0.75,
          ease: 'linear',
        },
      )
        .to(ref, {
          x: 2,
          y: 4,
          duration: 0.75,
          ease: 'linear',
        })
        .to(ref, {
          x: -2,
          y: 6,
          duration: 0.75,
          opacity: 0,
          ease: 'linear',
        });

      return tl;
    };

    tl.add(animate(snow.children[0]), 0.2)
      .add(animate(snow.children[1]), 0.3)
      .add(animate(snow.children[2]), 0.1);
  }, []);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default Snow;
