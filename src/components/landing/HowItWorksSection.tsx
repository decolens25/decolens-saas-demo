import React from 'react';
import { motion } from 'framer-motion';

interface HowItWorksSectionProps {
  onStartScanner: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartScanner }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Experience Art Like Never Before</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            DecoLens bridges the gap between your space and the perfect artwork with our innovative technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mjl8fHJvb218ZW58MHx8fHwxNzQzMTI3MDk1fDI\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400"
                alt="DecoLens app in action"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          <div className="space-y-8">
            <StepItem
              number={1}
              title="Scan Your Space"
              description="Use our intuitive camera interface to capture your room from different angles. Our AI analyzes vibe, lighting, color palette, and architectural elements."
              delay={0.1}
            />

            <StepItem
              number={2}
              title="Receive Personalized Recommendations"
              description="Our algorithm processes your room's unique characteristics and matches them with our extensive art database to suggest pieces that will complement your space perfectly."
              delay={0.2}
            />

            <StepItem
              number={3}
              title="Visualize and Purchase"
              description="See how each artwork will look in your space with our visualization tool. When you find the perfect piece, purchase directly from our trusted art partners."
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const StepItem: React.FC<StepItemProps> = ({ number, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-primary font-bold">{number}</span>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

export default HowItWorksSection;