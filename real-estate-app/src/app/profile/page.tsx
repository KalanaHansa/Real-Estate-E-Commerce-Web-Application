'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Camera, Lock, Save, Loader2, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileData {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  auth_provider: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('info');
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setFormData(prev => ({
          ...prev,
          full_name: data.user.full_name,
          phone: data.user.phone || '',
          avatar_url: data.user.avatar_url || '',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
      };

      if (formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setSaving(false);
          return;
        }
        if (formData.new_password.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
          setSaving(false);
          return;
        }
        payload.current_password = formData.current_password;
        payload.new_password = formData.new_password;
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile(data.user);
        setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white/30 object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-gray-50">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                <p className="text-blue-100 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" /> {profile.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.role === 'admin' ? 'bg-amber-400 text-amber-900' : 'bg-blue-400/30 text-white'
                  }`}>
                    {profile.role === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                    {profile.auth_provider === 'google' ? 'Google Account' : 'Email Account'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'info', label: 'Personal Info', icon: User },
                { id: 'security', label: 'Security', icon: Lock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 max-w-lg">
                {profile.auth_provider === 'google' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Google Authentication</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your account is managed through Google. Password changes are handled via your Google account settings.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={formData.current_password}
                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={formData.new_password}
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Min 6 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) logout();
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Log Out
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                <Save className="h-5 w-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Link
            href="/history"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Transaction History</h3>
                <p className="text-sm text-gray-500 mt-1">View your buying, selling, and renting records</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Link>

          {profile.role === 'admin' && (
            <Link
              href="/dashboard"
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Admin Dashboard</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage users, properties, and transactions</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}