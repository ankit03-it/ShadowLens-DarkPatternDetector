import { useState, useEffect } from 'react';

function LoadingState() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const phases = [
    'Parsing DOM structure...',
    'Running NLP classifiers...',
    'Matching pattern library...',
    'Scoring severity...',
    'Building report...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => {
        const next = prev + 1;
        if (next >= phases.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 580);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgressWidth(((currentPhase + 1) / phases.length) * 100);
  }, [currentPhase]);

  return (
    <div className="flex flex-col items-center gap-2.5 py-1.5">
      <div className="flex gap-1.25">
        <div className="w-1.25 h-1.25 rounded-full bg-purple/30 animate-pulse"></div>
        <div className="w-1.25 h-1.25 rounded-full bg-purple/30 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.25 h-1.25 rounded-full bg-purple/30 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <div className="w-55 h-0.5 bg-white/8 rounded-xs">
        <div 
          className="h-full bg-purple/90 rounded-xs transition-all" 
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
      <div className="text-tiny text-white/30 font-mono tracking-wider">
        {phases[currentPhase]}
      </div>
    </div>
  );
}

export default LoadingState;
