import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Eye, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How DecoLens Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform makes finding the perfect artwork for your space effortless and enjoyable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Camera className="h-8 w-8 text-primary" />}
            title="AI Room Analysis"
            description="Scan your room with our advanced camera technology to analyze dimensions, lighting, and style."
            delay={0.1}
          />
          
          <FeatureCard 
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            title="Personalized Recommendations"
            description="Receive curated art suggestions tailored to your space's unique characteristics and your preferences."
            delay={0.2}
          />
          
          <FeatureCard 
            icon={<Eye className="h-8 w-8 text-primary" />}
            title="Instant Visualization"
            description="See how each artwork will look in your space with our real-time visualization technology."
            delay={0.3}
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Expert Curation"
            description="Access a vast collection of artwork curated by art experts and enhanced by our AI technology."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-secondary p-6 rounded-lg text-center"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default FeaturesSection;