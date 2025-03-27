import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface CapturingViewProps {
  capturedImage: string | null;
  onRetake: () => void;
  onAnalyze: () => void;
}

const CapturingView: React.FC<CapturingViewProps> = ({
  capturedImage,
  onRetake,
  onAnalyze
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-black rounded-lg overflow-hidden mb-6">
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured room"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onRetake}
          className="btn btn-outline flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Retake</span>
        </button>
        
        <button
          className="btn btn-scanner flex items-center gap-2"
          onClick={onAnalyze}
        >
          <Sparkles className="h-5 w-5" />
          <span>Analyze Room</span>
        </button>
      </div>
    </div>
  );
};

export default CapturingView;