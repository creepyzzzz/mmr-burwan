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
import { Users, FileText, CheckCircle, XCircle, Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { safeFormatDateObject } from '../../utils/dateUtils';
import { useDebounce } from '../../hooks/useDebounce';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // State for data
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, unverified: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Items per page
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all'); // 'all', 'verified', 'unverified', 'draft'

  const totalPages = Math.ceil(totalCount / limit);

  // Load Stats (Initial only or on specific actions if needed)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await adminService.getApplicationStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []); // Run once on mount

  // Load Applications (On filter/page change)
  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      try {
        const { data, count } = await adminService.getApplications(page, limit, {
          search: debouncedSearchTerm,
          verified: verifiedFilter
        });
        setApplications(data);
        setTotalCount(count);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [page, limit, debouncedSearchTerm, verifiedFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, verifiedFilter]);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600">Manage marriage registration applications</p>
          </div>
          <Button
            onClick={() => navigate('/admin/create-application')}
            className="w-full sm:w-auto"
          >
            <UserPlus size={16} className="mr-2" />
            Create Application for Offline User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <Card
          className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => {
            setVerifiedFilter('all');
            setSearchTerm('');
          }}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Total Applications</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{stats.total}</p>
            </div>
            <FileText size={20} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gold-600 flex-shrink-0" />
          </div>
        </Card>
        <Card
          className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => {
            setVerifiedFilter('unverified'); // 'unverified' in filter logic maps to submitted/under_view pending verification
            // Actually stats.pending maps to status in [submitted, under_review].
            // To emulate "Pending Review" click, we might want 'submitted' filter or similar.
            // Let's assume 'submitted' filter covers pending review items effectively.
            setVerifiedFilter('submitted');
            setSearchTerm('');
          }}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Pending Review</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {stats.pending}
              </p>
            </div>
            <Users size={20} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
          </div>
        </Card>
        <Card
          className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => {
            setVerifiedFilter('verified');
            setSearchTerm('');
          }}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Verified</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {stats.verified}
              </p>
            </div>
            <CheckCircle size={20} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
          </div>
        </Card>
        <Card
          className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => {
            setVerifiedFilter('unverified');
            setSearchTerm('');
          }}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Unverified</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {stats.unverified}
              </p>
            </div>
            <XCircle size={20} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-rose-600 flex-shrink-0" />
          </div>
        </Card>
      </div>

      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={16} className="sm:w-5 sm:h-5" />}
            />
          </div>
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:outline-none text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="submitted">Submitted</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        )}

        {/* Mobile Card View */}
        {!isLoading && (
          <div className="block sm:hidden space-y-2">
            {applications.map((app) => (
              <Card key={app.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 mb-0.5">Application ID</p>
                      <p className="font-medium text-xs text-gray-900 truncate">{app.id}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Verified</p>
                      {app.verified !== undefined ? (
                        <Badge variant={app.verified ? 'success' : 'default'} className="!text-[10px]">
                          {app.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-gray-400">-</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Progress</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gold-500 h-1.5 rounded-full"
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500">{app.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Last Updated</p>
                    <p className="text-[10px] text-gray-600">{safeFormatDateObject(new Date(app.lastUpdated), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-[10px] !px-2 !py-1 flex-1"
                      onClick={() => {
                        navigate(`/admin/applications/${app.id}`);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-[10px] !px-2 !py-1 flex-1"
                      onClick={() => navigate(`/admin/chat?userId=${app.userId}`)}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Desktop Table View */}
        {!isLoading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Application ID</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Verified</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Progress</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Last Updated</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4">
                      <span className="font-medium text-[10px] sm:text-xs lg:text-sm text-gray-900 truncate block max-w-[120px] sm:max-w-none">{app.id}</span>
                    </td>
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4">
                      {app.verified !== undefined ? (
                        <Badge variant={app.verified ? 'success' : 'default'} className="!text-[10px] sm:!text-xs">
                          {app.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div
                            className="bg-gold-500 h-1.5 sm:h-2 rounded-full"
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-500">{app.progress}%</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4 text-[10px] sm:text-xs lg:text-sm text-gray-600">
                      {safeFormatDateObject(new Date(app.lastUpdated), 'MMM d, yyyy')}
                    </td>
                    <td className="py-2 sm:py-3 lg:py-4 px-2 sm:px-4">
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!text-[10px] sm:!text-xs !px-1.5 sm:!px-2"
                          onClick={() => {
                            navigate(`/admin/applications/${app.id}`);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!text-[10px] sm:!text-xs !px-1.5 sm:!px-2"
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
        )}

        {!isLoading && applications.length === 0 && (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <p className="text-xs sm:text-sm text-gray-500">No applications found</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="hidden sm:flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalCount)}</span> of{' '}
                  <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* We can show page numbers, but for now simple prev/next with current page info is enough or simple numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show generic window of pages centered on current page could be complex.
                    // For simplicity, let's just show current page and maybe neighbors if needed,
                    // or just rely on Prev/Next and "Page X of Y" text.
                    // Let's implement a simple version first.
                    // Actually, let's just use the buttons like: [1] ... [current] ... [last]
                    // For now, simple Prev | Next is fine.
                    return null;
                  })}
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
            {/* Mobile Pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                size="sm"
              >
                Previous
              </Button>
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
};

export default AdminDashboardPage;

