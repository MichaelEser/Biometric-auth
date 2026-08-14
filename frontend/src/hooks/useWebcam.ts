// Wraps the react-webcam ref
// Returns: webcamRef, captureFrame() -> base64 string, streamReady: bool

import { useRef, useState, useCallback } from "react";

export function useWebcam() {
  const webcamRef = useRef<any>(null);
  const [streamReady, setStreamReady] = useState(false);

  const captureFrame = useCallback((): string | null => {
    if (!webcamRef.current) return null;
    return webcamRef.current.getScreenshot();
  }, []);

  const onUserMedia = useCallback(() => {
    setStreamReady(true);
  }, []);

  const onUserMediaError = useCallback(() => {
    setStreamReady(false);
  }, []);

  return {
    webcamRef,
    streamReady,
    captureFrame,
    onUserMedia,
    onUserMediaError,
  };
}