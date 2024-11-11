/**
 * Handles background music playback following browser autoplay policies
 * Requires user interaction to start playing
 */
import { useEffect, useRef } from 'react';

function BackgroundMusic() {
  // Persistent audio instance across renders
  const audioRef = useRef(new Audio('/music.mp3'));

  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // 50% volume

    const initializeAudio = () => {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    };

    // One-time click listener for autoplay compliance
    document.addEventListener('click', initializeAudio, { once: true });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', initializeAudio);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  return null;
}

export default BackgroundMusic;