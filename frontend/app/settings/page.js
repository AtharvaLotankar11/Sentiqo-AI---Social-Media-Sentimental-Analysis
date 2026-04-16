'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Bell, Shield, Camera, Check, AlertTriangle, X, Lock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { getProfile, updateProfile, resetPassword } from '@/services/auth';
import Image from 'next/image';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    initials: '',
    profile_pic: null
  });
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Mock Notifications based on sentiment outcomes
  const notifications = [
    { id: 1, type: 'alert', text: 'Negative sentiment spike detected in Sample Dataset v1', time: '2h ago' },
    { id: 2, type: 'info', text: 'Recalculation of theme momentum complete', time: '5h ago' },
    { id: 3, type: 'success', text: 'New analyst node successfully provisioned', time: '1d ago' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setShowConfirm(false);
    try {
      const res = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        profile_pic: profile.profile_pic
      });
      setMessage({ type: 'success', text: 'Linguistic Profile Updated' });
      setProfile({ ...profile, initials: res.initials });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Protocol Error: Update Failed' });
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword) return;
    try {
      await resetPassword(newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setMessage({ type: 'success', text: 'Security Key Rotated Successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Encryption Error: Reset Failed' });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profile_pic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <RefreshCw className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-dark underline decoration-secondary decoration-4 underline-offset-8">
          ANALYST CONFIGURATION
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
          Manage identity, security, and notification protocols
        </p>
      </header>

      {message.text && (
        <div className={`p-4 border-4 border-black font-black uppercase italic text-sm shadow-neo-sm animate-bounce ${
          message.type === 'success' ? 'bg-secondary text-white' : 'bg-red-100 text-negative'
        }`}>
           {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-8 border-4 border-black shadow-neo-sm bg-white overflow-visible">
            <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
              <User size={20} />
              Identity Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Pic Section */}
              <div className="relative group">
                <input 
                  type="file" 
                  id="pfp-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <div className="w-32 h-32 rounded-full border-4 border-black bg-accent flex items-center justify-center overflow-hidden shadow-neo-sm">
                  {profile.profile_pic ? (
                    <img src={profile.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black">{profile.initials}</span>
                  )}
                </div>
                <button 
                  onClick={() => document.getElementById('pfp-upload').click()}
                  className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">First Name</label>
                  <input 
                    type="text" 
                    value={profile.first_name} 
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-black rounded-8 font-bold focus:ring-4 focus:ring-secondary/20 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.last_name} 
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-black rounded-8 font-bold focus:ring-4 focus:ring-secondary/20 outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-black rounded-8 font-bold focus:ring-4 focus:ring-secondary/20 outline-none placeholder:text-slate-300"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90 flex items-center justify-center gap-2"
                    onClick={() => setShowConfirm(true)}
                  >
                    <Check size={20} />
                    SAVE PROFILE CHANGES
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-8 border-4 border-black shadow-neo-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 px-4 py-1 bg-black text-white font-black text-[10px] uppercase">
               SECURITY-LEVEL-5
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
              <Shield size={20} />
              Access & Security
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-black rounded-8">
               <div>
                  <h3 className="font-black text-sm uppercase">Auth Key (Password)</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Regular rotation recommended for security compliance</p>
               </div>
               <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-1 bg-black text-white font-black text-xs uppercase border-2 border-black rounded-8 hover:translate-x-1 hover:translate-y-1 transition-all shadow-neo-sm"
               >
                 Rotate Key
               </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Notifications */}
        <div className="space-y-8">
          <Card className="p-6 border-4 border-black shadow-neo-sm bg-white h-full">
             <h2 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2 mb-6">
                <Bell size={20} />
                Protocol Logs
             </h2>
             <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-3 border-2 border-black rounded-8 bg-slate-50 relative">
                     <div className={`absolute top-0 right-0 w-2 h-full ${
                       notif.type === 'alert' ? 'bg-negative' : notif.type === 'success' ? 'bg-secondary' : 'bg-primary'
                     }`}></div>
                     <p className="text-[10px] font-black uppercase text-slate-400">{notif.time}</p>
                     <p className="text-xs font-bold uppercase leading-tight mt-1 pr-2">{notif.text}</p>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2 border-2 border-black rounded-8 font-black text-[10px] uppercase hover:bg-slate-50 transition-colors">
               Archived Logs
             </button>
          </Card>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <Card className="w-full max-w-sm p-8 bg-white border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 bg-accent rounded-full border-4 border-black flex items-center justify-center">
                    <AlertTriangle size={32} className="text-black" />
                 </div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-tight">Proceed with Identity Update?</h2>
                 <p className="text-xs font-bold text-slate-500 uppercase">This will write new data to the core analyst registry. This action is recorded.</p>
                 
                 <div className="flex gap-4 w-full mt-4">
                    <button 
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 border-4 border-black font-black uppercase text-sm hover:bg-slate-50 transition-colors"
                    >
                       Abandond
                    </button>
                    <button 
                      onClick={handleUpdate}
                      className="flex-1 py-3 bg-secondary text-white border-4 border-black font-black uppercase text-sm shadow-neo-sm hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                       Confirm
                    </button>
                 </div>
              </div>
           </Card>
        </div>
      )}

      {/* PASSWORD ROTATION MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <Card className="w-full max-w-md p-8 bg-white border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="p-3 bg-black text-white rounded-8">
                      <Lock size={24} />
                   </div>
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter">Rotate Security Key</h2>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-black uppercase text-slate-400">New Password String</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border-4 border-black rounded-8 font-black focus:ring-4 focus:ring-primary/20 outline-none"
                          placeholder="••••••••••••"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                 </div>

                 <Button 
                   className="w-full py-4 bg-black text-white"
                   onClick={handlePasswordReset}
                   disabled={!newPassword}
                 >
                   EXECUTE ROTATION
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
