import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  startTime?: number;
}

export function VideoPlayer({
  videoUrl,
  onTimeUpdate,
  onEnded,
  onError,
  startTime,
}: VideoPlayerProps) {
  // eslint-disable-next-line no-undef
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && startTime && startTime > 0) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime, videoUrl]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && onTimeUpdate) {
      onTimeUpdate(video.currentTime, video.duration);
    }
  };

  const handleError = () => {
    setHasError(true);
    onError?.('Failed to load video');
  };

  if (hasError) {
    return null; // VideoError component is rendered by parent
  }

  return (
    <div className="video-player-wrapper">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        autoPlay
        className="video-player-element"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onError={handleError}
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
