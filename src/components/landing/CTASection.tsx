import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CTASectionProps {
  onStartScanner?: () => void;
}

const CTASection: React.FC<CTASectionProps> = () => {
  const navigate = useNavigate();

  const startScanner = () => {
    navigate('/scanner');
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered the perfect artwork for their homes with DecoLens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startScanner}
              className="btn bg-white text-primary hover:bg-white/90 btn-lg"
            >
              Scan Your Room Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;