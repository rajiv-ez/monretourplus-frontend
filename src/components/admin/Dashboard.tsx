// Dashboard.tsx - Adapté à ton backend DRF (/api/avis/full/, /api/reclamations/full/)
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';
import { exportToCSV } from '../../utils/helpers';
import FeedbackTable from './FeedbackTable';
import ComplaintTable from './ComplaintTable';
import StatisticsSection from './StatisticsSection';
import UserManagement from './UserManagement';
import ServiceManagement from './ServicesManagement';
import Sidebar from './Sidebar';
import { usePaginatedApi } from '../../hooks/usePaginatedApi';
import { calculateComplaintStats, calculateFeedbackStats, calculateMonthlyStats } from '../../utils/stats';
import { Complaint, Feedback } from '../../types';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Hook paginé pour les avis
  const {
    data: feedbackData,
    next: feedbackNext,
    previous: feedbackPrev,
    count: feedbackCount,
    loading: feedbackLoading,
    setPageUrl: setFeedbackUrl,
    // reset: resetFeedback
  } = usePaginatedApi<Feedback>('/api/avis/full/');

  // Hook paginé pour les réclamations
  const {
    data: complaintData,
    next: complaintNext,
    previous: complaintPrev,
    count: complaintCount,
    loading: complaintLoading,
    setPageUrl: setComplaintUrl,
    // reset: resetComplaint
  } = usePaginatedApi<Complaint>('/api/reclamations/full/');


  // Plus besoin d'useEffect, tout est géré par les hooks paginés

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


  // Composant factorisé pour la pagination
  const PaginationControls = ({ next, previous, count, dataLength, setPageUrl }: {
    next: string | null;
    previous: string | null;
    count: number;
    dataLength: number;
    setPageUrl: (url: string) => void;
  }) => {
    // Pour éviter le hardcoding, on retire le baseUrl si présent
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const getPageNumber = (url: string | null) => {
      if (!url) return 1;
      const u = url.startsWith('http') ? url : baseUrl + url;
      const page = new URL(u).searchParams.get('page');
      return page ? Number(page) + 1 : 1;
    };
    // Calcul du numéro de page actuel
    let currentPage = 1;
    if (previous) {
      currentPage = getPageNumber(previous);
    }
    const totalPages = Math.ceil(count / 10);
    return (
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => previous && setPageUrl(previous.startsWith(baseUrl) ? previous.slice(baseUrl.length) : previous)}
          disabled={!previous}
        >
          Précédent
        </button>
        <span className="text-gray-600">
          {dataLength > 0 && (
            `Page ${currentPage} / ${totalPages}`
          )}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => next && setPageUrl(next.startsWith(baseUrl) ? next.slice(baseUrl.length) : next)}
          disabled={!next}
        >
          Suivant
        </button>
      </div>
    );
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
        return (
          <>
            <FeedbackTable feedback={feedbackData} />
            <PaginationControls
              next={feedbackNext}
              previous={feedbackPrev}
              count={feedbackCount}
              dataLength={feedbackData.length}
              setPageUrl={setFeedbackUrl}
            />
          </>
        );
      case 'complaints':
        return (
          <>
            <ComplaintTable initialComplaints={complaintData} />
            <PaginationControls
              next={complaintNext}
              previous={complaintPrev}
              count={complaintCount}
              dataLength={complaintData.length}
              setPageUrl={setComplaintUrl}
            />
          </>
        );
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

          {(feedbackLoading || complaintLoading) ? (
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