import React, { useRef } from 'react';
import { ReactComponent as Icon } from 'assets/weather/mist.svg';

function Mist() {
  const iconRef = useRef(null);

  return <Icon ref={iconRef} height={64} width={64} />;
}

export default Mist;
