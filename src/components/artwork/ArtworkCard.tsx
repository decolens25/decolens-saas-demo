import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    image_url: string;
    price: number | string;
    match?: number;
    medium?: string;
    style?: string;
    dimensions?: string;
    colors?: string[];
    year?: number;
  };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showMatch?: boolean;
  aspectRatio?: 'square' | '4/3';
  size?: 'sm' | 'md' | 'lg';
  recommendation?: {
    summary?: string;
    justification?: string;
  };
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  isFavorite = false,
  onToggleFavorite,
  showMatch = false,
  aspectRatio = 'square',
  size = 'md',
}) => {

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    onToggleFavorite?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white rounded-lg border overflow-hidden',
        size === 'sm' && 'text-sm'
      )}
    >
      <div className="relative">
        <Link to={`/artwork/${artwork.id}`}>
          <div
            className={cn(
              'overflow-hidden',
              aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/3]'
            )}
          >
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm transition-colors',
              isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </button>
        )}

        {showMatch && artwork.match && (
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            {artwork.match}% Match
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/artwork/${artwork.id}`}>
          <h3
            className={cn(
              'font-medium line-clamp-1',
              size === 'lg' && 'text-lg'
            )}
          >
            {artwork.title}
          </h3>
          <p className="text-muted-foreground line-clamp-1">{artwork.artist}</p>

          <div className="flex justify-between items-center mt-1">
            <p className="font-medium">
              $
              {typeof artwork.price === 'number'
                ? artwork.price.toLocaleString()
                : artwork.price}
            </p>
            {artwork.medium && (
              <span className="text-xs text-muted-foreground">
                {artwork.medium}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
