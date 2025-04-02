import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResponse } from '@decolens/decolens-sdk';

interface RoomAnalysisCardProps {
  capturedImage: string | null;
  analysisResponse: AnalysisResponse | null;
  onNewScan: () => void;
  isAnalyzing?: boolean;
  progress?: number;
}

const RoomAnalysisCard: React.FC<RoomAnalysisCardProps> = ({
  capturedImage,
  analysisResponse,
  onNewScan,
  isAnalyzing = false,
  progress = 0
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured room"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <motion.div
                  className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-sm">Analyzing room...</p>
              <p className="text-xs mt-1">{progress}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Purpose:</span>{' '}
            {isAnalyzing && !analysisResponse?.purpose ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              analysisResponse?.purpose || 'Not analyzed'
            )}
          </div>

          <div>
            <span className="text-muted-foreground">Ambiance:</span>{' '}
            {isAnalyzing && !analysisResponse?.ambiance ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              analysisResponse?.ambiance || 'Not analyzed'
            )}
          </div>

          <div>
            <span className="text-muted-foreground">Lighting:</span>{' '}
            {isAnalyzing && !analysisResponse?.lighting ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              analysisResponse?.lighting || 'Not analyzed'
            )}
          </div>

          <div>
            <span className="text-muted-foreground">Materials:</span>{' '}
            {isAnalyzing && !analysisResponse?.materials ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              analysisResponse?.materials || 'Not analyzed'
            )}
          </div>

          <div>
            <span className="text-muted-foreground">Color Palette:</span>
            <div className="flex gap-2 mt-1">
              {isAnalyzing && !analysisResponse?.colors ? (
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              ) : analysisResponse?.colors ? (
                analysisResponse.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))
              ) : (
                <span className="text-muted-foreground">No colors detected</span>
              )}
            </div>
          </div>

          {analysisResponse?.summary && (
            <div>
              <span className="text-muted-foreground">Summary:</span>
              <p className="mt-1 text-sm">{analysisResponse.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomAnalysisCard;