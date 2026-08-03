'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  LayoutDashboard, Users, Building2, DollarSign, 
  TrendingUp, Activity, ArrowLeft, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Properties', value: '567', icon: Building2, color: 'bg-green-50 text-green-600' },
    { label: 'Transactions', value: '$2.4M', icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
    { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-amber-500" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your real estate platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              <Shield className="h-4 w-4" />
              Administrator Access
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  This Month
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New user registration</p>
                    <p className="text-sm text-gray-500">User #{1000 + i} joined the platform</p>
                  </div>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Manage Users', desc: 'View and edit user accounts', icon: Users },
                { label: 'Manage Properties', desc: 'Approve and edit listings', icon: Building2 },
                { label: 'View Transactions', desc: 'Monitor all transactions', icon: DollarSign },
                { label: 'Site Settings', desc: 'Configure platform settings', icon: Shield },
              ].map((action, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <action.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-700">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Dashboard Under Development</h3>
          <p className="text-blue-700 text-sm max-w-2xl mx-auto">
            This admin dashboard is a placeholder. Full admin functionality with user management, 
            property approvals, analytics, and transaction monitoring will be implemented in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
}