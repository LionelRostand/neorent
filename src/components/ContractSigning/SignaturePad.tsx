
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pen, Trash2, Check, X } from 'lucide-react';

interface SignaturePadProps {
  onSignatureComplete: (signatureDataUrl: string, signerInfo: { name: string; role: string; date: string }) => void;
  signerName: string;
  signerRole: 'Propriétaire' | 'Locataire' | 'Colocataire';
  isReadOnly?: boolean;
  existingSignature?: string;
}

const SignaturePad = ({ onSignatureComplete, signerName, signerRole, isReadOnly = false, existingSignature }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!existingSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && existingSignature) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.type.startsWith('touch')) {
      const touchEvent = e as TouchEvent;
      const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      const mouseEvent = e as MouseEvent;
      return {
        x: (mouseEvent.clientX - rect.left) * scaleX,
        y: (mouseEvent.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isReadOnly) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(e.nativeEvent);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isReadOnly) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(e.nativeEvent);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setHasSignature(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureDataUrl = canvas.toDataURL();
    const signerInfo = {
      name: signerName,
      role: signerRole,
      date: new Date().toISOString()
    };

    onSignatureComplete(signatureDataUrl, signerInfo);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    // Empêcher le défilement lors du dessin sur mobile
    const preventScroll = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchmove', preventScroll);
    };
  }, [isDrawing]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base sm:text-lg">
            Signature - {signerRole}
          </CardTitle>
          <Badge variant={hasSignature ? "default" : "secondary"}>
            {hasSignature ? 'Signé' : 'En attente'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{signerName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border border-gray-200 rounded w-full touch-none"
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              cursor: isReadOnly ? 'default' : 'crosshair'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isReadOnly ? 'Signature validée' : 'Cliquez/touchez et faites glisser pour signer'}
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer
            </Button>
            <Button
              onClick={saveSignature}
              disabled={!hasSignature}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              <Check className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Valider la signature</span>
              <span className="sm:hidden">Valider</span>
            </Button>
          </div>
        )}

        {existingSignature && (
          <div className="text-xs text-gray-500 text-center">
            Signé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignaturePad;
