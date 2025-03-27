import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, ImageIcon, Info, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  scansRemaining?: number;
}

const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  onFileUpload,
  isUploading
}) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-black rounded-lg overflow-hidden mb-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
          }}
          className="w-full h-full object-cover"
        />

        {/* Camera overlay */}
        <div className="absolute inset-0 border-2 border-white/30 pointer-events-none">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white"></div>
        </div>

        {/* Camera instructions */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
          Position your room in the frame and tap the capture button
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline flex items-center gap-2"
          disabled={isUploading}
        >
          <ImageIcon className="h-5 w-5" />
          <span>Upload Image</span>
        </button>

        <button
          onClick={handleCapture}
          className="btn btn-scanner rounded-full w-16 h-16 flex items-center justify-center"
          disabled={isUploading}
        >
          <Camera className="h-8 w-8" />
        </button>

        <button
          onClick={() => toast.info('Position your room in the frame and ensure good lighting for best results.')}
          className="btn btn-outline flex items-center gap-2"
        >
          <Info className="h-5 w-5" />
          <span>Tips</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default CameraView;