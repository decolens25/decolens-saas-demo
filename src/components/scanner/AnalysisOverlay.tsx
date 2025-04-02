import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResponse } from '@decolens/decolens-sdk';

interface AnalysisOverlayProps {
  progress: number;
  analysisResponse: AnalysisResponse | null;
}

const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({
  progress,
  analysisResponse
}) => {
  const analysisStages = [
    "Detecting room dimensions...",
    "Analyzing lighting conditions...",
    "Identifying color palette...",
    "Determining room style...",
    "Matching with art database...",
    "Generating recommendations..."
  ];

  // Get current stage based on progress
  const currentStage = Math.min(
    Math.floor((progress / 100) * analysisStages.length),
    analysisStages.length - 1
  );

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-[#1e65f1] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <p className="text-white font-medium mt-4">{analysisStages[currentStage]}</p>

      <div className="mt-6 w-64 bg-white/20 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#1e65f1]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white/70 text-sm mt-2">{progress}%</p>

      {/* Show partial analysis results if available */}
      {analysisResponse && (
        <div className="mt-6 w-full max-w-md px-4">
          <div className="bg-white/10 rounded-lg p-3 text-white/90 text-sm">
            <p className="font-medium mb-1">AI Analysis:</p>
            <p className="text-xs text-white/80">{analysisResponse.eval}</p>

            {analysisResponse.recommendations && analysisResponse.recommendations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-white/90">Finding matches for:</p>
                <ul className="text-xs text-white/80 mt-1 space-y-1">
                  {analysisResponse.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} className="line-clamp-1">{rec.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisOverlay;