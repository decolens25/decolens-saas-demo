import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { fetchArtworks, fetchArtworkStyles, fetchArtworkMediums, type Artwork, type ArtworkFilters } from '../services/artworkService';
import toast from 'react-hot-toast';
import ArtworkCard from '../components/artwork/ArtworkCard';

// Filter options
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000 - $1500', min: 1000, max: 1500 },
  { label: 'Over $1500', min: 1500, max: Infinity }
];
const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest First'];

const BrowseArt: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [styleOptions, setStyleOptions] = useState<string[]>([]);
  const [mediumOptions, setMediumOptions] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [selectedMedium, setSelectedMedium] = useState('All Mediums');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState('Popularity');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load artwork styles and mediums
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const styles = await fetchArtworkStyles();
        const mediums = await fetchArtworkMediums();

        setStyleOptions(['All Styles', ...styles]);
        setMediumOptions(['All Mediums', ...mediums]);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Load artworks with filters
  useEffect(() => {
    const loadArtworks = async () => {
      setIsLoading(true);

      try {
        // Convert sortBy to the format expected by the API
        let sortByValue: ArtworkFilters['sortBy'] = 'popularity';
        switch (sortBy) {
          case 'Price: Low to High':
            sortByValue = 'price_asc';
            break;
          case 'Price: High to Low':
            sortByValue = 'price_desc';
            break;
          case 'Newest First':
            sortByValue = 'newest';
            break;
        }

        const filters: ArtworkFilters = {
          searchQuery,
          style: selectedStyle === 'All Styles' ? undefined : selectedStyle,
          medium: selectedMedium === 'All Mediums' ? undefined : selectedMedium,
          minPrice: selectedPriceRange.min,
          maxPrice: selectedPriceRange.max,
          sortBy: sortByValue,
          page: currentPage,
          limit: itemsPerPage
        };

        const { artworks: fetchedArtworks, count } = await fetchArtworks(filters);
        setArtworks(fetchedArtworks);
        setTotalCount(count);
      } catch (error) {
        console.error('Error loading artworks:', error);
        toast.error('Failed to load artworks');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, [searchQuery, selectedStyle, selectedMedium, selectedPriceRange, sortBy, currentPage, itemsPerPage]);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        toast.success('Removed from favorites');
        return prev.filter(itemId => itemId !== id);
      } else {
        toast.success('Added to favorites');
        return [...prev, id];
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All Styles');
    setSelectedMedium('All Mediums');
    setSelectedPriceRange(priceRanges[0]);
    setSortBy('Popularity');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            // Show first page, last page, current page, and pages around current page
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "btn btn-sm",
                    currentPage === page
                      ? "btn-primary"
                      : "btn-outline"
                  )}
                >
                  {page}
                </button>
              );
            } else if (
              (page === currentPage - 2 && currentPage > 3) ||
              (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return <span key={page}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-16 px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Browse Artwork</h1>
        <p className="text-muted-foreground">
          Discover curated pieces from our partner galleries and independent artists.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, artist, or style..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="input pl-10 w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-outline flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1); // Reset to first page on sort change
                }}
                className="input appearance-none pr-10"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-6 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter Options</h3>
              <button
                onClick={resetFilters}
                className="text-primary text-sm font-medium"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Style Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => {
                    setSelectedStyle(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="input w-full"
                >
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medium Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Medium
                </label>
                <select
                  value={selectedMedium}
                  onChange={(e) => {
                    setSelectedMedium(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="input w-full"
                >
                  {mediumOptions.map((medium) => (
                    <option key={medium} value={medium}>
                      {medium}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange.label}
                  onChange={(e) => {
                    const selected = priceRanges.find(range => range.label === e.target.value);
                    if (selected) {
                      setSelectedPriceRange(selected);
                      setCurrentPage(1); // Reset to first page on filter change
                    }
                  }}
                  className="input w-full"
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading artworks...
            </span>
          ) : (
            `Showing ${artworks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - ${Math.min(currentPage * itemsPerPage, totalCount)
            } of ${totalCount} artworks`
          )}
        </p>

        {artworks.length === 0 && !isLoading && (
          <button
            onClick={resetFilters}
            className="text-primary text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Artwork Grid */}
      {isLoading ? (
        renderSkeleton()
      ) : artworks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
            <X className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No artworks found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any artworks matching your current filters.
          </p>
          <button
            onClick={resetFilters}
            className="btn btn-outline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              isFavorite={favorites.includes(artwork.id)}
              onToggleFavorite={() => toggleFavorite(artwork.id)}
              aspectRatio="square"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && renderPagination()}

      {/* Scanner Promotion */}
      <div className="mt-20 bg-secondary/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-serif font-bold mb-3">
          Not sure what artwork fits your space?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Use our AI-powered scanner to analyze your room and receive personalized art recommendations that perfectly complement your space.
        </p>
        <Link to="/dashboard/scanner" className="btn btn-primary">
          Try the DecoLens Scanner
        </Link>
      </div>
    </div>
  );
};

export default BrowseArt;