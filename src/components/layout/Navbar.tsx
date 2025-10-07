import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isConnected = Boolean(localStorage.getItem("access_token"));
  const isStaff = localStorage.getItem("is_staff") === "true";
  const username = localStorage.getItem("username");

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
    <nav className="bg-gradient-to-r from-yellow-800 to-yellow-600 text-white shadow-lg relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="h-10 w-10 mr-2 rounded-full bg-white/90 shadow-lg ring-1 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90">
              <img src="/static/logo.png" alt="Logo" className="h-full w-full rounded-full object-cover" />
            </Link>
            <Link to="/" className="text-xl font-bold">MonRetourMSC+</Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {MenuLink("/", "Accueil")}
            {MenuLink("/feedback", "Donner un avis")}
            {MenuLink("/complaint", "Soumettre une réclamation")}

            

            {isConnected && isStaff && MenuLink("/admin", "Espace Admin")}
            {
              !isConnected ? MenuLink("/login", "Se connecter") : (
                <div className="flex items-center">
                  {isConnected && username && (
                    <span className="ml-4 px-3 py-1 rounded-full bg-white text-yellow-800 text-sm font-medium hidden md:inline-block">
                      {username}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
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

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-yellow-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-yellow-700">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={toggleMenu} className="p-2 rounded-md text-white hover:bg-yellow-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col px-4 py-4 space-y-3">
          {MenuLink("/", "Accueil")}
          {MenuLink("/feedback", "Donner un avis")}
          {MenuLink("/complaint", "Soumettre une réclamation")}
          {isConnected && isStaff && MenuLink("/admin", "Espace Admin")}
          {!isConnected ? MenuLink("/login", "Se connecter") : (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300"
            >
              Se déconnecter
            </button>
          )}
        </div>

        
        {/* Username mobile */}
        {isConnected && username && (
          <div className="px-4 py-2 mt-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white text-yellow-800 text-sm font-medium">
              {username}
            </span>
          </div>
        )}
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
