'use client'

import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  color?: string;
  barCount?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  isPlaying?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  className?: string;
  variant?: 'standard' | 'circular' | 'wave' | 'bars';
  sensitivity?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioRef,
  color = 'var(--gradient-neon)',
  barCount = 64,
  height = 50,
  barWidth = 3,
  gap = 2,
  isPlaying = false,
  animationSpeed = 'normal',
  className = '',
  variant = 'bars',
  sensitivity = 1.2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null);
  
  const fakeData = useRef<number[]>([]);
  const targetData = useRef<number[]>([]);
  const currentData = useRef<number[]>([]);
  
  // Initialize fake data for when no audio is available
  useEffect(() => {
    const initializeFakeData = () => {
      const data = [];
      for (let i = 0; i < barCount; i++) {
        data.push(Math.random() * 0.5 + 0.15); // Random values between 0.15 and 0.65
      }
      fakeData.current = data;
      targetData.current = [...data];
      currentData.current = Array(barCount).fill(0);
    };
    
    initializeFakeData();
    
    // Periodically update fake data
    const updateInterval = setInterval(() => {
      if (!isPlaying || !audioRef?.current) {
        for (let i = 0; i < barCount; i++) {
          targetData.current[i] = Math.random() * 0.5 + 0.15;
        }
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, [barCount, isPlaying, audioRef]);
  
  // Set up audio analyzer
  useEffect(() => {
    if (!audioRef?.current) return;
    
    let context: AudioContext;
    let source: MediaElementAudioSourceNode;
    let newAnalyser: AnalyserNode;
    
    const setupAnalyzer = () => {
      try {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
        source = context.createMediaElementSource(audioRef.current!);
        newAnalyser = context.createAnalyser();
        
        newAnalyser.fftSize = 256;
        source.connect(newAnalyser);
        newAnalyser.connect(context.destination);
        
        setAudioContext(context);
        setAudioSource(source);
        setAnalyser(newAnalyser);
      } catch (error) {
        console.error('Error setting up audio analyzer:', error);
      }
    };
    
    // Only set up analyzer when audio starts playing
    const handlePlay = () => {
      if (!audioContext) {
        setupAnalyzer();
      }
    };
    
    audioRef.current.addEventListener('play', handlePlay);
    
    return () => {
      audioRef.current?.removeEventListener('play', handlePlay);
      audioSource?.disconnect();
      analyser?.disconnect();
      audioContext?.close();
    };
  }, [audioRef]);
  
  // Animation update function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const speedFactor = animationSpeed === 'slow' ? 0.05 : animationSpeed === 'fast' ? 0.2 : 0.1;
    
    const drawVisualizer = () => {
      const bufferLength = analyser ? analyser.frequencyBinCount : barCount;
      const dataArray = new Uint8Array(bufferLength);
      
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        
        // Normalize data
        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount));
          targetData.current[i] = dataArray[index] / 255 * sensitivity;
        }
      }
      
      // Smooth transition
      for (let i = 0; i < barCount; i++) {
        currentData.current[i] += (targetData.current[i] - currentData.current[i]) * speedFactor;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw different visualizer variants
      switch (variant) {
        case 'circular':
          drawCircularVisualizer(ctx, canvas, currentData.current);
          break;
        case 'wave':
          drawWaveVisualizer(ctx, canvas, currentData.current);
          break;
        case 'standard':
          drawStandardVisualizer(ctx, canvas, currentData.current);
          break;
        case 'bars':
        default:
          drawBarsVisualizer(ctx, canvas, currentData.current);
          break;
      }
      
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };
    
    drawVisualizer();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying, barCount, barWidth, gap, height, sensitivity, variant, animationSpeed]);
  
  // Resize canvas on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = height;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);
  
  // Visualizer drawing methods
  const drawBarsVisualizer = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: number[]
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'var(--accent)');
    gradient.addColorStop(0.5, 'var(--primary-light)');
    gradient.addColorStop(1, 'var(--secondary)');
    
    ctx.fillStyle = gradient;
    
    const barWidth = canvas.width / (data.length * 2 - 1);
    
    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i] * canvas.height;
      const x = i * (barWidth * 2);
      const y = canvas.height - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };
  
  const drawStandardVisualizer = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: number[]
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'var(--accent)');
    gradient.addColorStop(0.5, 'var(--primary-light)');
    gradient.addColorStop(1, 'var(--secondary)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const sliceWidth = canvas.width / (data.length - 1);
    
    for (let i = 0; i < data.length; i++) {
      const x = i * sliceWidth;
      const y = canvas.height / 2 + (data[i] * canvas.height / 2) * (i % 2 === 0 ? 1 : -1);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  };
  
  const drawWaveVisualizer = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: number[]
  ) => {
    ctx.strokeStyle = 'var(--primary)';
    ctx.fillStyle = 'rgba(108, 17, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const sliceWidth = canvas.width / (data.length - 1);
    
    ctx.moveTo(0, canvas.height);
    
    for (let i = 0; i < data.length; i++) {
      const x = i * sliceWidth;
      const y = canvas.height - (data[i] * canvas.height);
      
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  
  const drawCircularVisualizer = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: number[]
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    ctx.strokeStyle = 'var(--primary)';
    ctx.lineWidth = 2;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
    
    // Draw data points
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const barHeight = data[i] * radius;
      
      const x = centerX + Math.cos(angle) * (radius + barHeight - radius);
      const y = centerY + Math.sin(angle) * (radius + barHeight - radius);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'var(--accent-light)');
    gradient.addColorStop(0.5, 'var(--primary)');
    gradient.addColorStop(1, 'var(--secondary)');
    
    ctx.fillStyle = 'rgba(108, 17, 255, 0.1)';
    ctx.fill();
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full"
        height={height}
      />
    </div>
  );
};
