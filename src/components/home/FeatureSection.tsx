import React from 'react';
import { MessageSquare, Clock, BarChart, Shield } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-yellow-600" />,
    title: 'Communication directe',
    description: 'Un canal direct pour partager vos impressions et préoccupations avec MSC Gabon.'
  },
  {
    icon: <Clock className="h-8 w-8 text-yellow-600" />,
    title: 'Temps de réponse rapide',
    description: 'Nous nous engageons à traiter chaque réclamation dans les plus brefs délais.'
  },
  {
    icon: <BarChart className="h-8 w-8 text-yellow-600" />,
    title: 'Amélioration continue',
    description: 'Vos avis nous aident à analyser et améliorer constamment nos services.'
  },
  {
    icon: <Shield className="h-8 w-8 text-yellow-600" />,
    title: 'Sécurité et confidentialité',
    description: 'Vos données sont traitées de manière confidentielle et sécurisée.'
  }
];

const FeatureSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi utiliser MonRetourMSC+?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre plateforme a été conçue pour faciliter et optimiser le processus de feedback entre vous et MSC Gabon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;