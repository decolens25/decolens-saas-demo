import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto pt-16 px-4 py-12 max-w-4xl">

      <h1 className="text-4xl font-serif font-bold mb-6">About DecoLens</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          DecoLens is revolutionizing the way people discover and visualize art in their spaces through
          the power of artificial intelligence and advanced machine learning technology.
        </p>

        <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Our Mission</h2>
        <p className="text-muted-foreground mb-6">
          We believe that finding the perfect artwork shouldn't be a matter of chance. Our mission is to
          help people discover art that not only matches their space perfectly but also resonates with
          their personal style and aesthetic preferences.
        </p>

        <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Our Technology</h2>
        <p className="text-muted-foreground mb-6">
          DecoLens combines state-of-the-art AI and machine learning technology to analyze your
          space and recommend artwork that complements your room's unique characteristics. Our platform
          considers factors like:
        </p>
        <ul className="list-disc pl-6 mb-6 text-muted-foreground">
          <li>Room's purpose</li>
          <li>Lighting conditions</li>
          <li>Color palette and existing décor</li>
          <li>Architectural features</li>
          <li>Style preferences</li>
        </ul>

        <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Our Team</h2>
        <p className="text-muted-foreground mb-6">
          DecoLens was founded by a technologist who share a passion for making art more accessible
          and helping people create spaces they love.
        </p>

        <div className="bg-secondary/100 rounded-lg p-6 mt-12">
          <h3 className="text-xl font-bold mb-3">Get Started with DecoLens</h3>
          <p className="text-muted-foreground mb-4">
            Ready to transform your space with the perfect artwork? Try our AI-powered art recommendation
            system today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;