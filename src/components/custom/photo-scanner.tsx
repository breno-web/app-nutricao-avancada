'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PhotoScannerProps {
  onScan: (foodName: string, estimatedWeight: number) => void;
  onClose: () => void;
}

export function PhotoScanner({ onScan, onClose }: PhotoScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Use o upload de foto.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
      analyzeFood(imageData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      analyzeFood(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async (imageData: string) => {
    setIsAnalyzing(true);

    // Simulação de análise de IA
    // Em produção, aqui você faria uma chamada para uma API de visão computacional
    // como OpenAI Vision, Google Cloud Vision, ou AWS Rekognition
    setTimeout(() => {
      // Exemplo de resultado simulado
      const mockResults = [
        { name: 'Arroz branco', weight: 150 },
        { name: 'Frango grelhado', weight: 120 },
        { name: 'Salada verde', weight: 80 },
        { name: 'Feijão preto', weight: 100 },
        { name: 'Batata doce', weight: 200 },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setIsAnalyzing(false);
      onScan(randomResult.name, randomResult.weight);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#FFA84C]" />
            Scanner de Alimentos por Foto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!capturedImage && !stream && (
            <div className="space-y-4">
              <Button
                onClick={startCamera}
                className="w-full h-16 text-lg bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C] text-white"
              >
                <Camera className="w-6 h-6 mr-2" />
                Abrir Câmera
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">ou</span>
                </div>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-16 text-lg border-2 border-[#FFA84C] text-[#FFA84C] hover:bg-orange-50"
              >
                <Upload className="w-6 h-6 mr-2" />
                Fazer Upload de Foto
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {stream && !capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 border-4 border-[#FFA84C] rounded-xl pointer-events-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={capturePhoto}
                  className="h-14 text-lg bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C] text-white"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capturar
                </Button>
                <Button
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  variant="outline"
                  className="h-14 text-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img src={capturedImage} alt="Foto capturada" className="w-full h-auto" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" />
                      <p className="text-lg font-bold">Analisando alimento...</p>
                      <p className="text-sm text-orange-200">Reconhecendo ingredientes e porções</p>
                    </div>
                  </div>
                )}
              </div>

              {!isAnalyzing && (
                <Button
                  onClick={() => {
                    setCapturedImage(null);
                    startCamera();
                  }}
                  variant="outline"
                  className="w-full h-12"
                >
                  Tirar Outra Foto
                </Button>
              )}
            </div>
          )}

          <div className="bg-orange-50 p-4 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">💡 Dicas para melhor resultado:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Fotografe o prato de cima, com boa iluminação</li>
              <li>• Mantenha a câmera paralela ao prato</li>
              <li>• Evite sombras e reflexos</li>
              <li>• Inclua todo o prato na foto</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
