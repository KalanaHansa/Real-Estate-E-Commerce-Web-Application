'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Filter, ShoppingCart, Home, Clock, 
  CheckCircle, XCircle, AlertCircle, Loader2,
  ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Transaction {
  id: number;
  property_id: number;
  property_title: string;
  property_listing_type: string;
  property_images?: string;
  transaction_type: 'buy' | 'rent';
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  buyer_name: string;
  seller_name: string;
  buyer_id: number;
  seller_id: number;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    if (user) fetchTransactions();
  }, [user, authLoading, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      params.set('page', filters.page.toString());
      params.set('limit', '10');

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (transaction: Transaction) => {
    const isBuyer = transaction.buyer_id === user?.id;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        isBuyer 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'bg-purple-50 text-purple-700 border border-purple-200'
      }`}>
        {isBuyer ? 'Buyer' : 'Seller'}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500 mt-1">Track your buying, selling, and renting activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => setFilters({ type: '', status: '', page: 1 })}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">You haven't made any transactions yet.</p>
              <div className="flex justify-center gap-4">
                <Link href="/buy" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Browse Properties
                </Link>
                <Link href="/sell" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  List Property
                </Link>
              </div>
            </div>
          ) : (
            transactions.map((transaction) => {
              const isBuyer = transaction.buyer_id === user?.id;
              const images = transaction.property_images ? JSON.parse(transaction.property_images) : [];
              
              return (
                <div key={transaction.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-48 h-48 md:h-auto relative bg-gray-100 flex-shrink-0">
                      {images[0] ? (
                        <Image
                          src={images[0]}
                          alt={transaction.property_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Home className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          transaction.property_listing_type === 'sale' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-green-600 text-white'
                        }`}>
                          For {transaction.property_listing_type === 'sale' ? 'Sale' : 'Rent'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{transaction.property_title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Transaction #{transaction.id} • {formatDate(transaction.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(transaction)}
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5 mt-1">
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                            {transaction.transaction_type === 'buy' ? 'Purchase' : 'Rental'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Amount</p>
                          <p className="font-bold text-lg text-blue-600 mt-0.5">{formatPrice(transaction.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">{isBuyer ? 'Seller' : 'Buyer'}</p>
                          <p className="font-medium text-gray-900 mt-1">
                            {isBuyer ? transaction.seller_name : transaction.buyer_name}
                          </p>
                        </div>
                        {transaction.end_date && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Lease End</p>
                            <p className="font-medium text-gray-900 mt-1">{formatDate(transaction.end_date)}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {transaction.start_date ? `Started ${formatDate(transaction.start_date)}` : 'Not started yet'}
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="h-4 w-4" />
                            Receipt
                          </button>
                          <Link
                            href={`/properties/${transaction.property_id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            View Property →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && transactions.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-3">
                Page {filters.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}