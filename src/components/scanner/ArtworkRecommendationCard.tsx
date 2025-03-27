import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Info, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

interface ArtworkRecommendationProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    image: string;
    price: string | number;
    match: number;
    medium?: string;
    style?: string;
    dimensions?: string;
    colors?: string[];
  };
  recommendation?: {
    summary: string;
    justification: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewDetails: () => void;
  onVisualize: () => void;
  isLoading?: boolean;
}

const ArtworkRecommendationCard: React.FC<ArtworkRecommendationProps> = ({
  artwork,
  recommendation,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onVisualize,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-2 mt-4">
            <div className="flex-1 h-8 bg-gray-200 rounded" />
            <div className="flex-1 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden group">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <button
          onClick={onToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm",
            isFavorite ? "text-red-500" : "text-gray-500"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
        
        {artwork.match && (
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            {artwork.match}% Match
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground">{artwork.artist}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm font-medium">${artwork.price}</p>
          {artwork.medium && (
            <span className="text-xs text-muted-foreground">{artwork.medium}</span>
          )}
        </div>
        
        {recommendation && (
          <div className="mt-3 p-2 bg-secondary/30 rounded-lg">
            <p className="text-sm">{recommendation.summary}</p>
            <p className="text-xs text-muted-foreground mt-1">{recommendation.justification}</p>
          </div>
        )}
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={onViewDetails}
            className="btn btn-sm btn-outline flex-1 flex items-center justify-center gap-1"
          >
            <Info className="h-4 w-4" />
            <span>Details</span>
          </button>
          
          <button
            onClick={onVisualize}
            className="btn btn-sm btn-scanner flex-1 flex items-center justify-center gap-1"
          >
            <Eye className="h-4 w-4" />
            <span>Visualize</span>
          </button>
        </div>
        
        <button
          onClick={() => toast.success('Opening purchase page...')}
          className="mt-2 w-full text-xs text-primary flex items-center justify-center gap-1 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View in Partner Gallery</span>
        </button>
      </div>
    </div>
  );
};

export default ArtworkRecommendationCard;