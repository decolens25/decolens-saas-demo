import React, { useState, useEffect } from 'react';
import { fetchPopularArtworks, type Artwork } from '../services/artworkService';

// Landing page components
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PopularArtSection from '../components/landing/PopularArtSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

// Testimonials
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quote: 'DecoLens has revolutionized how I approach art selection for my clients. The AI recommendations are spot-on and save me countless hours of searching.'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Home Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quote: 'I was struggling to find the right art for my living room until I tried DecoLens. The scanner suggested pieces I wouldn\'t have considered but look perfect in my space.'
  },
  {
    name: 'Emily Chen',
    role: 'Art Collector',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quote: 'As someone who loves art but struggles with visualization, DecoLens has been a game-changer. I can now confidently purchase pieces knowing they\'ll enhance my space.'
  }
];

const LandingPage: React.FC = () => {
  const [popularArtworks, setPopularArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load popular artworks
  useEffect(() => {
    const loadPopularArtworks = async () => {
      setIsLoading(true);
      const artworks = await fetchPopularArtworks(6);
      setPopularArtworks(artworks);
      setIsLoading(false);
    };

    loadPopularArtworks();
  }, []);

  return (
    <div className="pt-12 md:pt-16">
      <HeroSection />
      <FeaturesSection />
      <PopularArtSection artworks={popularArtworks} isLoading={isLoading} />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </div>
  );
};

export default LandingPage;