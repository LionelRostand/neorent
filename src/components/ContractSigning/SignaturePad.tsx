
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isReadOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Signature - {signerRole}
          </CardTitle>
          <Badge variant={hasSignature ? "default" : "secondary"}>
            {hasSignature ? 'Signé' : 'En attente'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{signerName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border border-gray-200 rounded cursor-crosshair w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isReadOnly ? 'Signature validée' : 'Cliquez et faites glisser pour signer'}
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer
            </Button>
            <Button
              onClick={saveSignature}
              disabled={!hasSignature}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Valider la signature
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
