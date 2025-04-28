import React, { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const BottomToastNotification = () => {
  const hasShownToast = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio('/sounds/ding.mp3');

    const unlockAudio = () => {
      // Try to unlock audio once on first user interaction
      audioRef.current.play().catch(() => {
        // Just catch and do nothing (browser blocks)
      });
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const atBottom = windowHeight + scrollTop >= documentHeight - 10;

      if (atBottom && !hasShownToast.current) {
        // Play sound now safely
        if (audioRef.current) {
          audioRef.current.play().catch((e) => console.log('Sound error:', e));
        }

        // Show beautiful toast
        toast.success('🎉 You have reached the bottom!', {
          duration: 1000,
          position: 'bottom-center',
          style: {
            background: 'linear-gradient(to right, #4e6ef0, #6f50c4)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
          className: 'animate-toastSlideUp',
        });

        hasShownToast.current = true;
      } else if (!atBottom && hasShownToast.current) {
        hasShownToast.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return null;
};

export default BottomToastNotification;