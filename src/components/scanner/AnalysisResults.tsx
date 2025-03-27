import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, ChevronDown } from 'lucide-react';
import { AnalysisResponse } from '../../lib/decolensapi';
import RoomAnalysisCard from './RoomAnalysisCard';
import ArtworkCard from '../artwork/ArtworkCard';
import RecommendationPreferences from './RecommendationPreferences';
import { fetchArtworksByIds } from '../../services/artworkService';
import { cn } from '../../utils/cn';

interface AnalysisResultsProps {
  capturedImage: string | null;
  analysisResponse: AnalysisResponse | null;
  onNewScan: () => void;
  onToggleFavorite: (artworkId: string) => void;
  onViewDetails: (artwork: any) => void;
  favorites: string[];
  isAnalyzing?: boolean;
  progress?: number;
  onUpdateRecommendations?: (preferences: { vibes: string[]; priceRange: [number, number] }) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  capturedImage,
  analysisResponse,
  onNewScan,
  onToggleFavorite,
  favorites,
  isAnalyzing = false,
  progress = 0,
  onUpdateRecommendations
}) => {
  const [artworkGroups, setArtworkGroups] = useState<{
    artworks: any[];
    summary: string;
    justification: string;
  }[]>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number] | undefined>();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  useEffect(() => {
    const loadArtworks = async () => {
      if (!analysisResponse?.recommendations) return;

      const groups = await Promise.all(
        analysisResponse.recommendations.map(async (rec) => {
          const artworks = await fetchArtworksByIds(rec.artworkIds);

          if (artworks.length === 0) return null;

          return {
            artworks,
            summary: rec.summary,
            justification: rec.justification,
          };
        })
      );

      setArtworkGroups(groups.filter(Boolean));
    };

    loadArtworks();
  }, [analysisResponse?.recommendations]);

  const handlePreferencesSubmit = (preferences: { vibes: string[]; priceRange: [number, number] }) => {
    setSelectedVibes(preferences.vibes);
    setCurrentPriceRange(preferences.priceRange);
    setShowPreferences(false);

    console.log("AnalysisResults");
    console.log(preferences);

    if (onUpdateRecommendations) {
      onUpdateRecommendations(preferences);
    }
  };

  // Show empty state if the artworkGroups have been loaded (null by default) and length is 0.
  if (!isAnalyzing && artworkGroups && artworkGroups.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="sticky top-20">
              <RoomAnalysisCard
                capturedImage={capturedImage}
                roomAnalysis={analysisResponse}
                onNewScan={onNewScan}
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No Recommendations Available</h3>
              <p className="text-muted-foreground mb-6">
                {analysisResponse ?
                  "No artworks could be found matching your preferences. Try adjusting your preferences or starting a new scan." :
                  "Previously recommended artworks are no longer available. Try starting a new scan."}
              </p>
              <button onClick={onNewScan} className="btn btn-primary">
                Start New Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="sticky top-20">
            <RoomAnalysisCard
              capturedImage={capturedImage}
              analysisResponse={analysisResponse}
              onNewScan={onNewScan}
              isAnalyzing={isAnalyzing}
              progress={progress}
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-8">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Art Recommendations</h2>
                    <p className="text-muted-foreground">
                      {isAnalyzing
                        ? 'Analyzing your room and finding the perfect artwork matches...'
                        : "Based on your space's style and aesthetics."}
                    </p>
                  </div>
                </div>

                {!isAnalyzing && onUpdateRecommendations && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowPreferences(!showPreferences)}
                      className={cn(
                        "btn btn-primary flex items-center gap-2 transition-colors",
                        showPreferences && "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      )}
                    >
                      <Sliders className="h-4 w-4" />
                      <span>Refine Results</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        showPreferences && "rotate-180"
                      )} />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t mt-4">
                      <RecommendationPreferences
                        onSubmit={handlePreferencesSubmit}
                        onCancel={() => setShowPreferences(false)}
                        isPro={true}
                        initialPriceRange={currentPriceRange}
                        initialVibes={selectedVibes}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {isAnalyzing || !artworkGroups ? (
            <div className="space-y-8">
              <div className="animate-pulse bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              <div className="space-y-6">
                <div className="animate-pulse bg-secondary rounded-lg p-6">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            artworkGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-6">
                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">{group.justification}</h3>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {group.artworks.map((artwork, index) => (
                      <motion.div
                        key={artwork.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ArtworkCard
                          artwork={artwork}
                          isFavorite={favorites.includes(artwork.id)}
                          onToggleFavorite={() => onToggleFavorite(artwork.id)}
                          showMatch={true}
                          aspectRatio="4/3"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;