'use client';

import { useRef, useState } from 'react';
import { Camera, X, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (imageData: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      setError('');
      setPermissionDenied(false);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.');
      } else if (err.name === 'NotFoundError') {
        setError('Nenhuma câmera encontrada no dispositivo.');
      } else {
        setError('Erro ao acessar câmera. Verifique as permissões.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onScan(capturedImage);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Fotografar Alimento</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {!isCameraActive && !capturedImage && !error && (
          <div className="text-center">
            <Camera className="w-24 h-24 text-white/50 mx-auto mb-6" />
            <Button 
              onClick={startCamera}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg"
            >
              <Camera className="w-6 h-6 mr-2" />
              Abrir Câmera
            </Button>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90">
            <div className="text-center p-6 max-w-sm">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <p className="text-white text-lg mb-6">{error}</p>
              
              {permissionDenied && (
                <div className="space-y-4">
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-left">
                    <p className="text-white text-sm mb-2 font-semibold">Como permitir acesso:</p>
                    <ol className="text-white text-xs space-y-1 list-decimal list-inside">
                      <li>Clique no ícone de cadeado/câmera na barra de endereço</li>
                      <li>Selecione &quot;Permitir&quot; para câmera</li>
                      <li>Recarregue a página se necessário</li>
                    </ol>
                  </div>
                  <Button 
                    onClick={startCamera} 
                    className="bg-orange-500 hover:bg-orange-600 w-full"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}
              
              {!permissionDenied && (
                <Button 
                  onClick={startCamera} 
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Tentar Novamente
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Video Preview */}
        {isCameraActive && (
          <div className="relative w-full max-w-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 border-4 border-orange-500/50 rounded-2xl pointer-events-none" />
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="relative w-full max-w-2xl">
            <img
              src={capturedImage}
              alt="Foto capturada"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
        {isCameraActive && (
          <div className="text-center space-y-4">
            <p className="text-white text-sm mb-4">
              Posicione o alimento no centro da tela e tire a foto
            </p>
            <Button
              onClick={capturePhoto}
              className="w-full max-w-md h-16 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Camera className="w-6 h-6 mr-2" />
              Tirar Foto
            </Button>
          </div>
        )}

        {capturedImage && (
          <div className="flex gap-3 max-w-md mx-auto">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1 h-14 text-base border-2 border-white text-white hover:bg-white/10"
            >
              <Camera className="w-5 h-5 mr-2" />
              Tirar Outra
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex-1 h-14 text-base bg-green-500 hover:bg-green-600 text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
