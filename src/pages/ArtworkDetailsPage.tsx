import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArtworkById, fetchSimilarArtworks } from '../services/artworkService';
import ArtworkDetails from '../components/artwork/ArtworkDetails';

const ArtworkDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<any>(null);
  const [similarArtworks, setSimilarArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArtwork = async () => {
      if (!id) return;

      setIsLoading(true);
      const fetchedArtwork = await fetchArtworkById(id);

      if (fetchedArtwork) {
        setArtwork(fetchedArtwork);

        // Load similar artworks
        const similar = await fetchSimilarArtworks(fetchedArtwork);
        setSimilarArtworks(similar);
      } else {
        navigate('/browse');
      }

      setIsLoading(false);
    };

    loadArtwork();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {

  };

  if (!artwork && !isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto pt-16 px-4 py-12">
      <ArtworkDetails
        artwork={artwork}
        similarArtworks={similarArtworks}
        isLoading={isLoading}
        isFavorite={false}
        onToggleFavorite={handleToggleFavorite}
        showBackButton={true}
      />
    </div>
  );
};

export default ArtworkDetailsPage;