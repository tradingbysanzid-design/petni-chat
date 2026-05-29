import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SettingsPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: user.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/auth/profile', {
        username: formData.username
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      setMessage('Password changed successfully!');
      setFormData({
        username: formData.username,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        setLoading(true);
        await axios.delete('/api/auth/account');
        onLogout();
        navigate('/');
      } catch (error) {
        setMessage('Error deleting account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-purple-500 border-opacity-30">
        <button
          onClick={() => setTab('profile')}
          className={`py-2 px-4 font-semibold ${tab === 'profile' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400'}`}
        >
          👤 Profile
        </button>
        <button
          onClick={() => setTab('security')}
          className={`py-2 px-4 font-semibold ${tab === 'security' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400'}`}
        >
          🔒 Security
        </button>
        <button
          onClick={() => setTab('preferences')}
          className={`py-2 px-4 font-semibold ${tab === 'preferences' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400'}`}
        >
          ⚙️ Preferences
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-8 ${message.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
          {message}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input opacity-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Gender</label>
              <div className="input bg-gray-700 cursor-not-allowed">
                {user.gender === 'ভূต' ? '👻 ভूत (Male)' : '🟣 पेत्नी (Female)'}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="space-y-8">
          <div className="card max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

          <div className="card max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Danger Zone</h2>
            <p className="text-gray-400 mb-4">Delete your account and all associated data permanently.</p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="btn bg-red-900 hover:bg-red-800 text-red-100 w-full"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {tab === 'preferences' && (
        <div className="card max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Notifications</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="font-semibold">Sound Effects</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="font-semibold">Dark Mode</label>
              <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-purple-500 border-opacity-30">
            <h3 className="text-xl font-bold mb-4">Account</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>💎 Magical Stones: {user.magical_stones}</p>
              <p>📅 Member Since: {new Date(user.created_at).toLocaleDateString()}</p>
              <p>🔐 Account Status: Active</p>
            </div>

            <button
              onClick={() => {
                onLogout();
                navigate('/');
              }}
              className="btn btn-secondary w-full mt-6"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
