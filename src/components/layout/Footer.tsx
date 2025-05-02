import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="mb-4 mr-2 md:mb-0">
                <img src="/static/logo-footer.png" alt="Logo" className="h-12" />
              </div>
              <span className="text-xl font-bold">MSC Gabon</span>
            </div>
            <p className="text-gray-300">
              MSC MEDITERRANEAN SHIPPING COMPANY GABON S.A.    
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-400" />
                <span>ga671-infogabon@msc.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-yellow-400" />
                <span>(+241) 011 70 51 35</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Owendo Business Center, Batiment A, 2ème étage</span>
              </li>
              <li className="flex items-center">
                <span className='ml-7'>Carrefour SNI - BP 18438 Owendo, GABON</span>
                <br/>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} MSC Gabon. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;