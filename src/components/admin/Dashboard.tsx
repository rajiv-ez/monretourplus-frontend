// Dashboard.tsx - Adapté à ton backend DRF (/api/avis/full/, /api/reclamations/full/)
import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';
import { exportToCSV } from '../../utils/helpers';
import FeedbackTable from './FeedbackTable';
import ComplaintTable from './ComplaintTable';
import StatisticsSection from './StatisticsSection';
import UserManagement from './UserManagement';
import ServiceManagement from './servicesManagement';
import Settings from './Settings';
import Sidebar from './Sidebar';
import api from '../../../services/api';
import { calculateComplaintStats, calculateFeedbackStats, calculateMonthlyStats } from '../../utils/stats';
import { Complaint, Feedback } from '../../types';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [complaintData, setComplaintData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const [feedbackRes, complaintRes] = await Promise.all([
          api.get('/api/avis/full/', { headers }),
          api.get('/api/reclamations/full/', { headers })

        ]);

        setFeedbackData(feedbackRes.data.results);
        setComplaintData(complaintRes.data.results);
      } catch (err) {
        console.error('Erreur de récupération des données :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();


  }, []);

  const monthlyStats = calculateMonthlyStats(feedbackData, complaintData);
  const complaintStats = calculateComplaintStats(complaintData);
  const feedbackStats = calculateFeedbackStats(feedbackData);

  const handleExportFeedback = () => {
    exportToCSV(feedbackData, 'feedback-export');
  };

  const handleExportComplaints = () => {
    exportToCSV(complaintData, 'complaints-export');
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    closeSidebar();
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-600 mb-1">Avis positifs</p>
                <p className="text-4xl font-bold text-green-600">{feedbackStats.totalPositive}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((feedbackStats.totalPositive / feedbackData.length) * 100).toFixed(1)}% du total
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-500">
                <p className="text-gray-600 mb-1">Avis négatifs</p>
                <p className="text-4xl font-bold text-red-600">{feedbackStats.totalNegative}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((feedbackStats.totalNegative / feedbackData.length) * 100).toFixed(1)}% du total
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-l-4 border-yellow-500">
                <p className="text-gray-600 mb-1">Réclamations en attente</p>
                <p className="text-4xl font-bold text-yellow-600">
                  {complaintStats.totalPending + complaintStats.totalInProgress}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(((complaintStats.totalPending + complaintStats.totalInProgress) / complaintData.length) * 100).toFixed(1)}% du total
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-600 mb-1">Réclamations résolues</p>
                <p className="text-4xl font-bold text-blue-600">{complaintStats.totalResolved}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((complaintStats.totalResolved / complaintData.length) * 100).toFixed(1)}% du total
                </p>
              </div>
            </div>

            <StatisticsSection
              monthlyStats={monthlyStats}
              complaintStats={complaintStats}
              feedbackStats={feedbackStats}
            />
          </>
        );
      case 'feedback':
        return <FeedbackTable feedback={feedbackData} />;
      case 'complaints':
        return <ComplaintTable initialComplaints={complaintData} />;
      case 'statistics':
        return (
          <StatisticsSection
            monthlyStats={monthlyStats}
            complaintStats={complaintStats}
            feedbackStats={feedbackStats}
          />
        );
      case 'services':
        return <ServiceManagement />;
      case 'users':
        return <UserManagement />;
      // case 'settings':
      //   return <Settings />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Section en développement</p>
          </div>
        );
    }
  };



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
        />
      </div>


      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {activeSection === 'overview' && "Vue d'ensemble"}
                {activeSection === 'feedback' && "Avis clients"}
                {activeSection === 'complaints' && "Réclamations"}
                {activeSection === 'statistics' && "Statistiques"}
                {activeSection === 'users' && "Utilisateurs"}
                {activeSection === 'settings' && "Paramètres"}
              </h1>
            </div>

            <div className="flex space-x-2 md:space-x-4">
              {(activeSection === 'overview' || activeSection === 'feedback') && (
                <Button
                  variant="outline"
                  onClick={handleExportFeedback}
                  icon={<Download className="h-5 w-5" />}
                  className="hidden sm:flex"
                >
                  Exporter les avis
                </Button>
              )}

              {(activeSection === 'overview' || activeSection === 'complaints') && (
                <Button
                  variant="outline"
                  onClick={handleExportComplaints}
                  icon={<Download className="h-5 w-5" />}
                  className="hidden sm:flex"
                >
                  Exporter les réclamations
                </Button>
              )}

              {/* Mobile export button */}
              {(activeSection === 'overview' || activeSection === 'feedback' || activeSection === 'complaints') && (
                <Button
                  variant="outline"
                  onClick={activeSection === 'feedback' ? handleExportFeedback : handleExportComplaints}
                  icon={<Download className="h-5 w-5" />}
                  className="sm:hidden"
                >
                  Exporter
                </Button>
              )}

            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement des données...</div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


function setFeedbackData(feedbackJson: any) {
  throw new Error('Function not implemented.');
}


function setComplaintData(complaintJson: any) {
  throw new Error('Function not implemented.');
}


function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
