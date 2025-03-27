import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { cn } from '../../utils/cn';

interface HeroSectionProps {
  onStartScanner?: () => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const roomGallery = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
];

const HeroSection: React.FC<HeroSectionProps> = () => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const navigate = useNavigate();

  const startScanner = () => {
    navigate('/scanner');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoomIndex((prev) => (prev + 1) % roomGallery.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {roomGallery.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              activeRoomIndex === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="absolute inset-0 bg-black/40" />
            <img
              src={image}
              alt={`Room design ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
          >
            Transform Your Space with AI-Curated Art
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl text-white/90 mb-8 max-w-2xl"
          >
            DecoLens uses advanced AI to analyze your room and recommend the perfect artwork that complements your space and style.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={startScanner}
              className="btn btn-scanner btn-lg flex items-center justify-center gap-2"
            >
              <Camera className="h-5 w-5" />
              <span>Find Your Perfect Art</span>
            </button>

            <Link to="/browse" className="btn btn-outline btn-lg bg-white/10 text-white border-white/20 hover:bg-white/20">
              Browse Popular Pieces
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {roomGallery.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveRoomIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              activeRoomIndex === index
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`View room design ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;