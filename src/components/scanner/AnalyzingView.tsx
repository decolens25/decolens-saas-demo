import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResponse } from '../../lib/decolensapi';

interface AnalyzingViewProps {
  capturedImage: string | null;
  progress?: number;
  analysisResponse?: AnalysisResponse | null;
}

const AnalyzingView: React.FC<AnalyzingViewProps> = ({ 
  capturedImage, 
  progress = 0,
  analysisResponse
}) => {
  const [analysisStage, setAnalysisStage] = useState(0);
  
  const analysisStages = [
    "Detecting room dimensions...",
    "Analyzing lighting conditions...",
    "Identifying color palette...",
    "Determining room style...",
    "Matching with art database...",
    "Generating recommendations..."
  ];
  
  useEffect(() => {
    // Update analysis stage based on progress
    if (progress < 15) setAnalysisStage(0);
    else if (progress < 30) setAnalysisStage(1);
    else if (progress < 45) setAnalysisStage(2);
    else if (progress < 60) setAnalysisStage(3);
    else if (progress < 80) setAnalysisStage(4);
    else setAnalysisStage(5);
  }, [progress]);
  
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
        
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-[#1e65f1] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-white font-medium mt-4">{analysisStages[analysisStage]}</p>
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
      </div>
      
      <div className="max-w-md text-center">
        <h3 className="text-lg font-medium mb-2">AI Analysis in Progress</h3>
        <p className="text-muted-foreground">
          Our AI is analyzing your room's style, lighting, dimensions, and color palette to find the perfect artwork matches.
        </p>
      </div>
    </div>
  );
};

export default AnalyzingView;