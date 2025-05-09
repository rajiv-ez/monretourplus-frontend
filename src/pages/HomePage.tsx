import React from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeatureSection from '../components/home/FeatureSection';
import TestimonialSection from '../components/home/TestimonialSection';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    if (location.state?.fromFeedback) {
      toast.success('Merci pour votre avis! Votre retour est important pour nous.');
    } else if (location.state?.fromComplaint) {
      toast.success('Votre réclamation a été enregistrée! Nous y donnerons suite dans les meilleurs délais.');
    }
  }, [location]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
      </main>
    </div>
  );
};

export default HomePage;