import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Eye, X, Check, Loader2, Info, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import ArtworkCard from './ArtworkCard';


export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  price: number | string;
  medium?: string;
  style?: string;
  description?: string | null;
  year?: number;
  width?: number;
  height?: number;
  dimension_unit?: string;
  product_url?: string;
  partner?: string;
}

interface ArtworkDetailsProps {
  artwork: Artwork;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  similarArtworks?: Artwork[];
  showBackButton?: boolean;
  showCloseButton?: boolean;
}

const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
  artwork,
  isFavorite = false,
  onToggleFavorite,
  onClose,
  isLoading = false,
  similarArtworks = [],
  showBackButton = true,
  showCloseButton = false,
}) => {

  // Format dimensions string
  const formatDimensions = () => {
    if (artwork.width && artwork.height && artwork.dimension_unit) {
      return `${artwork.width} ${artwork.dimension_unit} × ${artwork.height} ${artwork.dimension_unit}`;
    }
    return 'Dimensions not available';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard!');
  };

  const handlePurchase = () => {
    if (artwork.product_url) {
      window.open(artwork.product_url, '_blank');
    } else {
      toast.success('Redirecting to purchase page...');
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.();
  };

  return (
    <>
      <div className="space-y-8">
        {/* Navigation */}
        <div className="flex justify-between items-center">
          {showBackButton && (
            <Link to="/browse" className="inline-flex items-center text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Browse</span>
            </Link>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="inline-flex items-center text-muted-foreground hover:text-primary"
            >
              <X className="h-4 w-4 mr-1" />
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Artwork Details */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-serif font-bold">{artwork.title}</h1>
                <p className="text-xl text-muted-foreground">
                  {artwork.artist}
                  {artwork.year && `, ${artwork.year}`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "btn btn-outline btn-sm",
                    isFavorite && "text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </button>

                <button
                  onClick={handleShare}
                  className="btn btn-outline btn-sm"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold">${typeof artwork.price === 'number' ? artwork.price.toLocaleString() : artwork.price}</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{formatDimensions()}</p>
                </div>
                {artwork.medium && (
                  <div>
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <p className="font-medium">{artwork.medium}</p>
                  </div>
                )}
                {artwork.style && (
                  <div>
                    <p className="text-sm text-muted-foreground">Style</p>
                    <p className="font-medium">{artwork.style}</p>
                  </div>
                )}
                {artwork.partner && (
                  <div>
                    <p className="text-sm text-muted-foreground">Partner Gallery</p>
                    <p className="font-medium">{artwork.partner}</p>
                  </div>
                )}
              </div>

              {artwork.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-muted-foreground">{artwork.description}</p>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handlePurchase}
                className="btn btn-primary w-full"
              >
                Purchase Artwork
              </button>

              <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">DecoLens Verified Partner</p>
                    <p className="text-sm text-muted-foreground">
                      This artwork is sold by a verified gallery partner. Authenticity guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Artworks */}
        {similarArtworks.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold">You Might Also Like</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarArtworks.map((similar) => (
                <ArtworkCard
                  key={similar.id}
                  artwork={similar}
                  aspectRatio="square"
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArtworkDetails;