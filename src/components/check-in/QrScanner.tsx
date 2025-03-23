
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrScannerProps {
  onSuccess: (data: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const startScanner = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startScanningLoop();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  // Simulates QR code detection in this demo
  const startScanningLoop = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    scanIntervalRef.current = window.setInterval(() => {
      if (canvasRef.current && videoRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // In a real app, we'd now analyze the canvas for QR codes
          // For this demo, we'll simulate finding a QR code after a random interval
          
          // Clear the interval to prevent multiple detections
          if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
          }
          
          // Simulate QR code detection after a short delay
          setTimeout(() => {
            // Simulate client ticket IDs from localStorage bookings
            let ticketIds = ['TKT-1001', 'TKT-2001', 'TKT-3001'];
            
            // Try to get real booking data from localStorage
            const storedBookings = localStorage.getItem('clientBookings');
            if (storedBookings) {
              const bookings = JSON.parse(storedBookings);
              if (bookings.length > 0) {
                ticketIds = bookings.map((b: any) => b.ticketId);
              }
            }
            
            const randomTicket = ticketIds[Math.floor(Math.random() * ticketIds.length)];
            
            stopScanner();
            onSuccess(randomTicket);
            
            // Log this action for recent activity
            console.log(`Ticket scanned: ${randomTicket}`);
          }, 2000 + Math.random() * 1000);
        }
      }
    }, 500);
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[300px] aspect-square bg-black rounded-lg overflow-hidden mb-4">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
              <div className="absolute inset-0 border-2 border-dashed border-primary animate-pulse rounded-lg" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/80" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Camera className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center px-4">
              {error || 'Press start to scan a QR code'}
            </p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <Button
        type="button"
        onClick={isScanning ? stopScanner : startScanner}
        className="min-w-32"
      >
        {isScanning ? (
          <>
            <span>Cancel</span>
          </>
        ) : (
          <>
            {error ? <RefreshCw className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
            <span>{error ? 'Try Again' : 'Start Scanner'}</span>
          </>
        )}
      </Button>
    </div>
  );
};
