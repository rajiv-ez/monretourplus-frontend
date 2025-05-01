import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const clientPrenom = localStorage.getItem("client_prenom");
const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("/banner.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 leading-tight">
          {clientPrenom ? `${clientPrenom}, `: ""} Votre avis compte pour MSC Gabon
        </h1>
        
        <p className="text-xl max-w-3xl text-center mb-12 text-yellow-100">
          Aidez-nous à améliorer nos services en partageant votre expérience ou en nous faisant part de vos préoccupations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-3 rounded-full">
                <ThumbsUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-3">Donner un avis</h2>
            <p className="text-center mb-6 text-yellow-100">
              Partagez votre expérience avec nos services et aidez-nous à nous améliorer.
            </p>
            <div className="flex justify-center">
              <Link to="/feedback">
                <Button variant="primary" className="bg-white bg-opacity-25 hover:bg-opacity-40 border border-white border-opacity-50" icon={<ArrowRight className="h-5 w-5" />}>
                  Laisser un avis
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-3">Soumettre une réclamation</h2>
            <p className="text-center mb-6 text-yellow-100">
              Rencontrez-vous un problème avec nos services? Faites-nous en part.
            </p>
            <div className="flex justify-center">
              <Link to="/complaint">
                <Button variant="primary" className="bg-white bg-opacity-25 hover:bg-opacity-40 border border-white border-opacity-50" icon={<ArrowRight className="h-5 w-5" />}>
                  Créer une réclamation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;