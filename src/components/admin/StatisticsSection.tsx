import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import Card from '../common/Card';
import { MonthlyStats, ComplaintStats, FeedbackStats } from '../../types';

interface StatisticsSectionProps {
  monthlyStats: MonthlyStats[];
  complaintStats: ComplaintStats;
  feedbackStats: FeedbackStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  monthlyStats,
  complaintStats,
  feedbackStats
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Monthly Feedback Trends */}
      <Card title="Évolution mensuelle des avis">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="averageRating"
                stroke="#8884d8"
                name="Note moyenne"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="complaintCount"
                stroke="#82ca9d"
                name="Nombre de réclamations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Resolution Time by Category */}
      <Card title="Temps de résolution par catégorie">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complaintStats.resolutionsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Nombre de réclamations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ratings Distribution */}
      <Card title="Distribution des notes">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Positifs', value: feedbackStats.totalPositive },
                  { name: 'Neutres', value: feedbackStats.totalNeutral },
                  { name: 'Négatifs', value: feedbackStats.totalNegative }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[
                  { color: '#4ade80' },
                  { color: '#facc15' },
                  { color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Department Performance */}
      <Card title="Performance par département">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feedbackStats.ratingsByDepartment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageRating" fill="#8884d8" name="Note moyenne" />
              <Bar dataKey="count" fill="#82ca9d" name="Nombre d'avis" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsSection;