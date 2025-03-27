import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decolensApi, AnalysisResponse, Preferences } from '../../lib/decolensapi';
import toast from 'react-hot-toast';

// Components
import CameraView from './CameraView';
import CapturingView from './CapturingView';
import AnalysisResults from './AnalysisResults';
import ArtworkDetails, { Artwork } from '../artwork/ArtworkDetails';

// Scanner states
enum ScannerState {
  CAMERA = 'camera',
  CAPTURING = 'capturing',
  ANALYZING = 'analyzing',
  RESULTS = 'results',
  DETAILS = 'details',
}

interface ScannerContainerProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  title?: string;
}

const ScannerContainer: React.FC<ScannerContainerProps> = ({
  onClose,
  showCloseButton = false,
  title = "Let's scan the room"
}) => {
  const [scannerState, setScannerState] = useState<ScannerState>(ScannerState.CAMERA);

  // Image and analysis state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisController, setAnalysisController] = useState<AbortController | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<AnalysisResponse | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  // Artwork state
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Clean up analysis controller on unmount
  useEffect(() => {
    return () => {
      if (analysisController) {
        analysisController.abort();
      }
    };
  }, [analysisController]);

  // Capture image from webcam
  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setScannerState(ScannerState.CAPTURING);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setScannerState(ScannerState.CAPTURING);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the actual analysis
  const runAnalysis = async (newPreferences?: Preferences) => {
    // Reset analysis state
    setAnalysisProgress(0);
    setAnalysisResponse(null);

    // Move to results view immediately
    setScannerState(ScannerState.RESULTS);

    try {
      if (!capturedImage) {
        throw new Error('No image captured');
      }

      // Start new analysis
      const controller = await decolensApi.analyzeRoom(
        capturedImage,
        newPreferences,
        {
          onPartial: (response) => {
            setAnalysisResponse(response);
            setAnalysisProgress((prev) => Math.min(prev + 1, 90));
          },
          onComplete: async (response) => {
            setAnalysisResponse(response);
            setAnalysisProgress(100);
          },
          onError: (error) => {
            console.error('Analysis error:', error);
            toast.error('There was an error analyzing your room. Please try again.');
            setScannerState(ScannerState.CAMERA);
          }
        }
      );

      setAnalysisController(controller);
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Failed to start room analysis. Please try again.');
      setAnalysisProgress(100);
    }
  };

  // Reset scanner state
  const resetScanner = () => {
    if (analysisController) {
      analysisController.abort();
      setAnalysisController(null);
    }

    setCapturedImage(null);
    setSelectedArtwork(null);
    setAnalysisResponse(null);
    setAnalysisProgress(0);
    setPreferences(null);
    setCurrentScanId(null);
    setScannerState(ScannerState.CAMERA);
  };

  // Toggle favorite
  const toggleFavorite = (artworkId: string) => {
    setFavorites(prev => {
      if (prev.includes(artworkId)) {
        toast.success('Removed from favorites');
        return prev.filter(id => id !== artworkId);
      } else {
        toast.success('Added to favorites');
        return [...prev, artworkId];
      }
    });
  };

  // View artwork details
  const viewArtworkDetails = (artwork) => {
    setSelectedArtwork(artwork);
    setScannerState(ScannerState.DETAILS);
  };

  const onUpdateRecommendations = (prefs: { vibes: string[]; priceRange: [number, number] }) => {
    setPreferences(prefs);
    runAnalysis(prefs);
  };

  // Render content based on current state
  const renderContent = () => {
    switch (scannerState) {
      case ScannerState.CAMERA:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground">
                We will make art recommendations tailored to your space's aesthetics.
              </p>
            </div>
            <CameraView
              onCapture={handleCapture}
              onFileUpload={handleFileUpload}
              isUploading={false}
            />
            {showCloseButton && onClose && (
              <div className="mt-8 text-center">
                <button onClick={onClose} className="btn btn-outline">
                  Back to Home
                </button>
              </div>
            )}
          </div>
        );

      case ScannerState.CAPTURING:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Review Your Space</h1>
              <p className="text-muted-foreground">
                Make sure your room is clearly visible before proceeding with the analysis.
              </p>
            </div>
            <CapturingView
              capturedImage={capturedImage}
              onRetake={resetScanner}
              onAnalyze={runAnalysis}
            />
            {showCloseButton && onClose && (
              <div className="mt-8 text-center">
                <button onClick={onClose} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            )}
          </div>
        );

      case ScannerState.RESULTS:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">DecoLens AI Analysis</h1>
              <p className="text-muted-foreground">
                Based on your room's style and aesthetics, we've curated these perfect matches for your space.
              </p>
            </div>
            <AnalysisResults
              capturedImage={capturedImage}
              analysisResponse={analysisResponse}
              onNewScan={resetScanner}
              onToggleFavorite={toggleFavorite}
              onViewDetails={viewArtworkDetails}
              favorites={favorites}
              isAnalyzing={analysisProgress < 100}
              progress={analysisProgress}
              onUpdateRecommendations={onUpdateRecommendations}
            />
            {showCloseButton && onClose && (
              <div className="mt-8 text-center">
                <button onClick={onClose} className="btn btn-outline">
                  Back to Home
                </button>
              </div>
            )}
          </div>
        );

      case ScannerState.DETAILS:
        return selectedArtwork ? (
          <ArtworkDetails
            artwork={selectedArtwork}
            isFavorite={favorites.includes(selectedArtwork.id)}
            onToggleFavorite={() => toggleFavorite(selectedArtwork.id)}
            onClose={() => setScannerState(ScannerState.RESULTS)}
            showBackButton={false}
            showCloseButton={true}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={scannerState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

    </>
  );
};

export default ScannerContainer;