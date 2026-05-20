import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Cake3D from './Cake3D';
import './App.css';

// Sakura floating petals
const SakuraPetal = ({ index }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 1;
  const randomDuration = 3 + Math.random() * 4;
  const size = 8 + Math.random() * 12;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '-10%',
        left: `${randomX}%`,
        width: size,
        height: size,
        background: 'rgba(255, 183, 197, 0.7)',
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(45deg)',
        zIndex: 50,
        boxShadow: '0 0 5px rgba(255, 183, 197, 0.4)'
      }}
      animate={{
        y: ['0vh', '110vh'],
        x: ['0vw', `${(Math.random() - 0.5) * 30}vw`],
        rotate: [45, 180, 360]
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

function App() {
  const [phase, setPhase] = useState('intro'); // intro -> reveal -> cake -> card
  const [isBlown, setIsBlown] = useState(false);
  const audioContextRef = useRef(null);

  const startExperience = () => {
    setPhase('reveal');
    setTimeout(() => {
      setPhase('cake');
      startMicrophone();
    }, 2500); // Sped up: 2.5 seconds
  };

  const triggerConfetti = () => {
    const duration = 2.5 * 1000; // Sped up
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb7c5', '#ffffff', '#ff69b4']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb7c5', '#ffffff', '#ff69b4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleBlowOut = () => {
    if (!isBlown) {
      setIsBlown(true);
      triggerConfetti();
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Move to card phase after 2.5 seconds (Sped up)
      setTimeout(() => {
        setPhase('card');
      }, 2500);
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;
        for (let i = 0; i < array.length; i++) {
          values += array[i];
        }
        const average = values / array.length;
        
        if (average > 60 && !isBlown) { 
          handleBlowOut();
          stream.getTracks().forEach(track => track.stop());
        }
      };
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div 
            key="intro"
            className="aesthetic-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            onClick={startExperience}
          >
            <div className="intro-content">
              <span className="intro-text">Tap to begin</span>
            </div>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div 
            key="reveal"
            className="aesthetic-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            {[...Array(20)].map((_, i) => <SakuraPetal key={i} index={i} />)}
            
            <motion.h1 
              className="reveal-text"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Happy Birthday
            </motion.h1>
          </motion.div>
        )}

        {phase === 'cake' && (
          <motion.div 
            key="cake"
            className="cake-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="message-overlay">
              <h1 className="elegant-title">{isBlown ? 'Yay!' : 'Make a wish'}</h1>
              <p className="elegant-subtitle">
                {isBlown ? 'A special message awaits you...' : 'Blow into your mic to extinguish the candles'}
              </p>
            </div>
            
            <div className="cake-canvas-wrapper">
              <Cake3D isBlown={isBlown} />
            </div>
          </motion.div>
        )}

        {phase === 'card' && (
          <motion.div 
            key="card"
            className="card-scene"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="birthday-card">
              <div className="card-content">
                <h2>For You</h2>
                <p>
                  Wishing you the happiest of birthdays. May your day be filled with 
                  joy, love, and wonderful surprises. Keep shining bright!
                </p>
                <button 
                  className="card-btn" 
                  onClick={() => window.open('https://wa.me/6281290679370', '_blank')}
                >
                  Reply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
