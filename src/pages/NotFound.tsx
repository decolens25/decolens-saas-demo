import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Camera } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="inline-flex items-center justify-center mb-6">
          <Camera className="h-8 w-8 mr-2" />
          <span className="font-serif text-2xl font-bold">DecoLens</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Link>
          
          <Link to="/browse" className="btn btn-outline flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Browse Artwork</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;