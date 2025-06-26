import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isConnected = Boolean(localStorage.getItem("access_token"));
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const MenuLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md ${location.pathname === to ? 'bg-yellow-900' : 'hover:bg-yellow-700'} transition-colors duration-300`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-yellow-800 to-yellow-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="h-10 w-10 mr-2 rounded-full bg-white/90 shadow-lg ring-1 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90">
              <img src="/static/logo.png" alt="Logo" className="h-full w-full rounded-full object-cover" />
            </Link>
            <Link to="/" className="text-xl font-bold">MonRetourMSC+</Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            {MenuLink("/", "Accueil")}
            {MenuLink("/feedback", "Donner un avis")}
            {MenuLink("/complaint", "Soumettre une réclamation")}

            {isConnected && isAdmin && MenuLink("/admin", "Espace Admin")}
            {
              !isConnected ? MenuLink("/login", "Se connecter") : (

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300"
                >
                  Se déconnecter
                </button>

              )
            }
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-white hover:bg-yellow-700">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-yellow-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {MenuLink("/", "Accueil")}
            {MenuLink("/feedback", "Donner un avis")}
            {MenuLink("/complaint", "Soumettre une réclamation")}
            
            {isConnected && isAdmin && MenuLink("/admin", "Espace Admin")}
            {!isConnected ? MenuLink("/login", "Se connecter") : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-yellow-800 transition-colors duration-300"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
