import React from 'react';

const testimonials = [
  {
    content: 'Le système de réclamation est très efficace. J\'ai obtenu une réponse dans les 48 heures et mon problème a été résolu rapidement.',
    author: 'Marie L.',
    company: 'Gabon Logistics Company'
  },
  {
    content: 'Grâce à cette plateforme, nous avons pu exprimer nos préoccupations directement. MSC a pris en compte nos suggestions et a amélioré certains processus.',
    author: 'Jean P.',
    company: 'African Import-Export'
  },
  {
    content: 'Interface intuitive et facile à utiliser. C\'est un excellent moyen pour MSC de montrer qu\'ils accordent de l\'importance à l\'avis de leurs clients.',
    author: 'Sophie K.',
    company: 'TransCargo Gabon'
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients qui ont utilisé MonRetourMSC+.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex-1">
                <div className="text-yellow-600 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;