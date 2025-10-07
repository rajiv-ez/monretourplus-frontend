import React from 'react';
import { LayoutDashboard, MessageSquare, AlertTriangle, Settings, Users, BarChart } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors
      ${active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const isSuperUser = localStorage.getItem('is_superuser') === 'true';

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'feedback', label: 'Avis clients', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'complaints', label: 'Réclamations', icon: <AlertTriangle className="h-5 w-5" /> },
    { id: 'statistics', label: 'Statistiques', icon: <BarChart className="h-5 w-5" /> },
    { id: 'services', label: 'Services', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users className="h-5 w-5" /> },
    //{ id: 'settings', label: 'Paramètres', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Administration</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            ((item.id !== 'users' && item.id !== 'services') || isSuperUser) &&

            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;