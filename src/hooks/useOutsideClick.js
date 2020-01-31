import { useEffect } from 'react';

export function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = e => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      const styles = window.getComputedStyle(ref.current);
      if (parseFloat(styles.getPropertyValue('opacity')) < 1) {
        return;
      }

      handler(e);
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}
