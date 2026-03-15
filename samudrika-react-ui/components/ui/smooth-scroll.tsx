'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioEnabledRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const turbineOscRef = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const modGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    console.log("🔊 Initializing NUCLEAR TURBINE Propulsion...");
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 1. Primary Turbine Core (Square wave for mechanical grit)
    const turbine = ctx.createOscillator();
    turbine.type = 'square';
    turbine.frequency.setValueAtTime(45, ctx.currentTime); // Deep industrial E1

    // 2. Sub-Bass Rumble
    const sub = ctx.createOscillator();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(32, ctx.currentTime);

    // 3. Amplitude Modulator (Low Frequency Oscillator for that rhythmic 'chug')
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4, ctx.currentTime); // 4Hz chug
    lfoGain.gain.setValueAtTime(0.5, ctx.currentTime);

    lfo.connect(lfoGain.gain);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);

    turbine.connect(filter);
    sub.connect(filter);
    filter.connect(masterGain);

    turbine.start();
    sub.start();
    lfo.start();

    turbineOscRef.current = turbine;
    subOscRef.current = sub;
    modGainRef.current = lfoGain;

    // Startup sequence log
    console.log("🔊 TURBINE: Ready for propulsion.");
  };

  const playTapSound = () => {
    if (!audioCtxRef.current || !audioEnabledRef.current || audioCtxRef.current.state !== 'running') return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // 1. The High-Tech "Click" (Transient)
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sine';
    click.frequency.setValueAtTime(2400, now);
    click.frequency.exponentialRampToValueAtTime(800, now + 0.02);
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(0.2, now + 0.001);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    // 2. The Mechanical "Thud" (Body)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(150, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.06);
    thudGain.gain.setValueAtTime(0, now);
    thudGain.gain.linearRampToValueAtTime(0.1, now + 0.002);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);

    click.start(now);
    click.stop(now + 0.05);
    thud.start(now);
    thud.stop(now + 0.12);
  };

  useEffect(() => {
    window.addEventListener('mousedown', playTapSound);
    return () => window.removeEventListener('mousedown', playTapSound);
  }, [isAudioEnabled]);

  useEffect(() => {
    let locomotiveScroll: any = null;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let velocity = 0;
    let rafId: number;

    const trackVelocity = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      velocity = diff * 0.7 + velocity * 0.3; // Responsive smoothing
      lastScrollY = currentScrollY;

      if (masterGainRef.current && turbineOscRef.current && audioCtxRef.current) {
        if (audioEnabledRef.current && audioCtxRef.current.state === 'running') {
          const now = audioCtxRef.current.currentTime;
          
          // PROPULSION PHYSICS:
          // Volume follows movement speed (max 0.6)
          const targetVol = Math.min(velocity * 0.08, 0.6);
          // Pitch rises slightly under load (45Hz -> 75Hz)
          const targetFreq = 45 + Math.min(velocity * 0.8, 30);
          
          masterGainRef.current.gain.setTargetAtTime(targetVol, now, 0.05);
          turbineOscRef.current.frequency.setTargetAtTime(targetFreq, now, 0.1);
        } else {
          masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        }
      }
      rafId = requestAnimationFrame(trackVelocity);
    };

    (async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        locomotiveScroll = new LocomotiveScroll({
          lenisOptions: { 
            lerp: 0.1, 
            duration: 1.2,
            smoothWheel: true 
          },
        });
        rafId = requestAnimationFrame(trackVelocity);
      } catch (err) {
        console.error("Locomotive Scroll initialization failed:", err);
      }
    })();

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
      if (audioCtxRef.current) audioCtxRef.current.close();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioCtxRef.current) initAudio();
    
    if (audioCtxRef.current) {
      if (!isAudioEnabled) {
        audioCtxRef.current.resume().then(() => {
          console.log("🔊 PROPULSION: Online");
          setIsAudioEnabled(true);
          audioEnabledRef.current = true;
          playTapSound(); // Feedback
        });
      } else {
        console.log("🔊 PROPULSION: Offline");
        setIsAudioEnabled(false);
        audioEnabledRef.current = false;
      }
    }
  };

  return (
    <>
      {children}
      
      {/* Sound Toggle Button - High Contrast */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-8 right-8 z-[999] w-14 h-14 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
        title={isAudioEnabled ? "Shut Down Turbine" : "Initialize Propulsion"}
      >
        {isAudioEnabled ? (
          <Volume2 className="size-6 animate-pulse text-[#0044ff]" />
        ) : (
          <VolumeX className="size-6 opacity-30" />
        )}
      </button>
    </>
  );
}


