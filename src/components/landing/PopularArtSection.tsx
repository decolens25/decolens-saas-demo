import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Artwork } from '../../services/artworkService';
import ArtworkCard from '../artwork/ArtworkCard';

interface PopularArtSectionProps {
  artworks: Artwork[];
  isLoading?: boolean;
}

const PopularArtSection: React.FC<PopularArtSectionProps> = ({ artworks, isLoading = false }) => {
  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Popular Artwork</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover trending pieces loved by our community of art enthusiasts and interior designers.
            </p>
          </div>
          <Link to="/browse" className="mt-4 md:mt-0 btn btn-outline">
            View All Artwork
          </Link>
        </div>

        {isLoading ? (
          renderSkeleton()
        ) : artworks.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading popular artworks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                aspectRatio="4/3"
                size="lg"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularArtSection;