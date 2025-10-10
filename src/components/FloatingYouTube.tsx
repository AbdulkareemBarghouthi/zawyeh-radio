import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface FloatingYouTubeProps {
  channelId?: string;
  isVisible?: boolean;
  onMinimize?: () => void;
}

export function FloatingYouTube({ 
  channelId = "UCbs3Tu0wKdQtVDKrrp4Zocg", // Default to your channel
  isVisible = true,
  onMinimize 
}: FloatingYouTubeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Start minimized on mobile by default
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  
  // Fixed position in bottom right with mobile responsiveness
  const getPosition = () => {
    if (typeof window === 'undefined') return { x: 20, y: 20 };
    
    // Full screen when expanded
    if (isExpanded) return { x: 0, y: 0 };
    
    const isMobile = window.innerWidth < 768;
    const margin = isMobile ? 10 : 20;
    
    const widths = {
      minimized: isMinimized ? 140 : 0,
      normal: !isMinimized && !isExpanded ? 320 : 0,
    };
    
    const heights = {
      minimized: isMinimized ? 60 : 0,
      normal: !isMinimized && !isExpanded ? 220 : 0,
    };
    
    const currentWidth = widths.minimized || widths.normal;
    const currentHeight = heights.minimized || heights.normal;
    
    return {
      x: Math.max(margin, window.innerWidth - currentWidth - margin),
      y: Math.max(margin, window.innerHeight - currentHeight - margin)
    };
  };
  
  const position = getPosition();

  // Handle window resize and orientation changes on mobile
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize to recalculate position
      setIsExpanded(prev => prev);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  if (!isVisible) return null;

  const toggleExpanded = () => {
    if (!isMinimized) {
      setIsExpanded(!isExpanded);
    }
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      // When restoring from minimized, go back to normal size
      setIsExpanded(false);
    }
  };

  // For live streams, use the channel's live stream URL
  const embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&enablejsapi=1&playsinline=1`;

  // Function to handle iframe load and seek to live
  const handleIframeLoad = (iframe: HTMLIFrameElement) => {
    // For live streams, try to message the iframe to seek to live head
    setTimeout(() => {
      try {
        iframe.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[999999999,true]}', '*');
      } catch (error) {
        console.log('Could not seek to live head:', error);
      }
    }, 2000); // Wait 2 seconds for the video to load
  };

  const getContainerSize = () => {
    if (isMinimized) return { width: '140px', height: '60px' };
    if (isExpanded) return { width: '100vw', height: '100vh' };
    return {
      width: '320px',
      height: '220px',
    };
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded 
          ? 'bg-black' 
          : 'bg-black border border-white/20 shadow-2xl'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        ...getContainerSize(),
      }}
    >
      {isMinimized ? (
        // Minimized state - Large transparent LIVE button
        <button
          onClick={toggleMinimized}
          className="w-full h-full relative flex items-center justify-center gap-2 bg-black/20 hover:bg-black/30 transition-all duration-300 rounded-lg border border-white/20 backdrop-blur-sm"
          title="Restore video player"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <img 
              src="/som3a.svg" 
              alt="Som3a" 
              className="w-6 h-6 opacity-80"
            />
            <span className="text-white text-base font-bold drop-shadow-lg">LIVE</span>
          </div>
        </button>
      ) : (
        // Normal state - full video player
        <>
          {/* Control Bar */}
          <div className={`absolute top-0 left-0 right-0 bg-black/90 border-b border-white/10 p-3 flex items-center justify-between z-10 ${
            isExpanded ? 'p-4' : 'p-2'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className={`text-white font-medium ${isExpanded ? 'text-sm' : 'text-xs'}`}>
                LIVE
              </span>
              {isExpanded && (
                <span className="text-white/70 text-sm ml-2">Zawyeh Radio</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleExpanded}
                className={`hover:bg-white/10 rounded transition-colors ${
                  isExpanded ? 'p-2' : 'p-1'
                }`}
                title={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-3 h-3 text-white" />
                )}
              </button>
              <button
                onClick={toggleMinimized}
                className={`hover:bg-white/10 rounded transition-colors ${
                  isExpanded ? 'p-2' : 'p-1'
                }`}
                title="Minimize to button"
              >
                <Minimize2 className={`text-white ${isExpanded ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className={`w-full h-full ${isExpanded ? 'pt-12' : 'pt-8'}`}>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Zawyeh Radio Live Stream"
              onLoad={(e) => handleIframeLoad(e.target as HTMLIFrameElement)}
            />
          </div>

          {/* Resize Handle */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/20"></div>
        </>
      )}
    </div>
  );
}