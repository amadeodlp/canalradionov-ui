'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@components/atoms/Button/Button';
import { AudioVisualizer } from '@components/atoms/AudioVisualizer/AudioVisualizer';
import { Input } from '@components/atoms/Input/Input';

interface BroadcastStudioProps {
  onStartBroadcast?: (sessionId: string) => void;
  onStopBroadcast?: () => void;
  className?: string;
}

export const BroadcastStudio: React.FC<BroadcastStudioProps> = ({
  onStartBroadcast,
  onStopBroadcast,
  className = '',
}) => {
  // State for broadcasting
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [listenerCount, setListenerCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Initialize audio context and analyser
  useEffect(() => {
    if (audioStream && !audioContext.current) {
      // Create audio context
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyser
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      
      // Connect stream to analyser
      const source = audioContext.current.createMediaStreamSource(audioStream);
      source.connect(analyser.current);
      
      // Set up data array for analyser
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
      
      // Start audio level monitoring
      monitorAudioLevel();
    }
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, [audioStream]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopBroadcast();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  // Monitor audio level
  const monitorAudioLevel = () => {
    if (!analyser.current || !dataArray.current) return;
    
    const updateLevel = () => {
      if (!analyser.current || !dataArray.current) return;
      
      analyser.current.getByteFrequencyData(dataArray.current);
      
      // Calculate average level
      let sum = 0;
      const data = dataArray.current;
      for (let i = 0; i < data.length; i++) {
        sum += data[i];
      }
      const average = sum / data.length;
      const normalizedLevel = average / 255; // Normalize to 0-1 range
      
      setAudioLevel(normalizedLevel);
      requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };
  
  // Start broadcast
  const startBroadcast = async () => {
    if (!broadcastTitle) {
      setErrorMessage('Please enter a title for your broadcast');
      return;
    }
    
    setErrorMessage(null);
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Generate session ID (in a real app, this would come from the backend)
      const newSessionId = `broadcast-${Date.now()}`;
      setSessionId(newSessionId);
      
      // Connect to WebSocket for broadcast (in a real app)
      // This would connect to your backend WebSocket endpoint
      const socket = new WebSocket('wss://api.example.com/ws/broadcast');
      socketRef.current = socket;
      
      socket.onopen = () => {
        // Send broadcast info
        socket.send(JSON.stringify({
          action: 'startBroadcast',
          sessionId: newSessionId,
          title: broadcastTitle,
          description: broadcastDescription
        }));
        
        // Start sending audio chunks
        // In a real implementation, you'd process the audio stream and send it over WebSocket
        
        // Start elapsed time counter
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
        
        // Update UI
        setIsBroadcasting(true);
        
        // Callback
        if (onStartBroadcast) {
          onStartBroadcast(newSessionId);
        }
      };
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Handle listener count updates
        if (data.type === 'listeners') {
          setListenerCount(data.count);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setErrorMessage('Failed to connect to broadcast server');
        stopBroadcast();
      };
      
    } catch (error) {
      console.error('Error starting broadcast:', error);
      setErrorMessage('Failed to access microphone. Please check your permissions.');
    }
  };
  
  // Stop broadcast
  const stopBroadcast = () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop audio stream
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    // Close WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'stopBroadcast',
        sessionId
      }));
      socketRef.current.close();
      socketRef.current = null;
    }
    
    // Reset state
    setIsBroadcasting(false);
    setElapsedTime(0);
    setListenerCount(0);
    setSessionId(null);
    
    // Callback
    if (onStopBroadcast) {
      onStopBroadcast();
    }
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <div className={`bg-neutral-800 rounded-xl overflow-hidden ${className}`}>
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white mb-1">Broadcast Studio</h2>
        <p className="text-white/60">Create your live radio show</p>
      </div>
      
      <div className="p-6">
        {!isBroadcasting ? (
          // Broadcast setup form
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Broadcast Title</label>
              <Input
                placeholder="Enter a title for your broadcast"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                placeholder="What's your broadcast about?"
                value={broadcastDescription}
                onChange={(e) => setBroadcastDescription(e.target.value)}
                className="w-full bg-neutral-700/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>
            
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={startBroadcast}
                leftIcon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                }
              >
                Start Broadcasting
              </Button>
              
              {errorMessage && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
          </div>
        ) : (
          // Live broadcast UI
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{broadcastTitle}</h3>
                <p className="text-white/60">{broadcastDescription}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-white/60">Listeners</div>
                  <div className="text-xl font-semibold text-white">{listenerCount}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-white/60">Duration</div>
                  <div className="text-xl font-semibold text-white">{formatTime(elapsedTime)}</div>
                </div>
              </div>
            </div>
            
            <div className="h-24">
              <AudioVisualizer
                variant="wave"
                isPlaying={true}
                sensitivity={audioLevel * 2 + 0.5} // Scale the sensitivity based on audio level
                animationSpeed="fast"
                height={96}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${audioLevel > 0.1 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-white/60">{audioLevel > 0.1 ? 'Live' : 'No audio detected'}</span>
              </div>
              
              <Button
                variant="danger"
                size="md"
                onClick={stopBroadcast}
                leftIcon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                  </svg>
                }
              >
                End Broadcast
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastStudio;
