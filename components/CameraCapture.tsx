import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface Props {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<Props> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-purple-600"></div>
        </button>
      </div>
      <div className="absolute bottom-28 left-0 right-0 text-center text-white/70 bg-black/30 py-1">
        请确保全身位于画面中
      </div>
    </div>
  );
};