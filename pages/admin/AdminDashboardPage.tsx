import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/admin';
import { applicationService } from '../../services/application';
import { Application } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { Users, FileText, CheckCircle, XCircle, Search } from 'lucide-react';
import { safeFormatDateObject } from '../../utils/dateUtils';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await adminService.getAllApplications();
        setApplications(apps);
        setFilteredApplications(apps);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter((app) =>
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
      approved: 'success',
      submitted: 'info',
      under_review: 'warning',
      rejected: 'error',
      draft: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage marriage registration applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <FileText size={32} className="text-gold-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length}
              </p>
            </div>
            <Users size={32} className="text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === 'approved').length}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === 'rejected').length}
              </p>
            </div>
            <XCircle size={32} className="text-rose-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={20} />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Application ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verified</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{app.id}</span>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-4 px-4">
                    {app.verified !== undefined ? (
                      <Badge variant={app.verified ? 'success' : 'default'}>
                        {app.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{app.progress}%</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {safeFormatDateObject(new Date(app.lastUpdated), 'MMM d, yyyy')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate(`/admin/applications/${app.id}`);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/chat?userId=${app.userId}`)}
                      >
                        Message
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboardPage;

