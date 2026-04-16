'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, LogOut, X, Upload, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { getCurrentUser, logout, getProfile } from '@/services/auth';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        // Fallback to local storage if API fails
        const activeUser = getCurrentUser();
        setUser(activeUser?.user || null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Analysis', icon: <MessageSquare size={20} />, path: '/sentiment' },
    { name: 'Trends', icon: <BarChart3 size={20} />, path: '/trends' },
    { name: 'Ingestion', icon: <Upload size={20} />, path: '/upload' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white border-r-2 border-black transform transition-transform duration-300 ease-in-out flex flex-col
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo Area */}
      <div className="p-5 border-b-2 border-black flex items-center justify-center bg-primary text-white relative">
        <div className="w-52 h-28 bg-white border-4 border-black flex items-center justify-center overflow-hidden shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer">
          <Image 
            src="/icon-logo.png" 
            alt="Sentiqo Logo" 
            width={180} 
            height={100}
            className="object-contain"
          />
        </div>
        
        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1 border-2 border-black rounded-8 hover:bg-white hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-8 border-2 transition-all font-bold text-sm ${
                isActive
                  ? 'bg-primary text-white border-black shadow-neo-sm'
                  : 'bg-white text-dark border-transparent hover:border-black hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile/Footer */}
      <div className="p-3 border-t-2 border-black bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-full border-2 border-black bg-secondary/80 shrink-0 flex items-center justify-center shadow-neo-sm overflow-hidden text-white">
             {user?.profile_pic ? (
               <Image 
                 src={user.profile_pic} 
                 alt="Profile" 
                 width={40} 
                 height={40} 
                 className="w-full h-full object-cover"
               />
             ) : (
               <span className="font-black text-sm tracking-tighter shadow-sm">
                 {user?.initials || '??'}
               </span>
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm leading-tight text-dark break-words">
              {user ? user.username : 'Guest'}
            </span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Analyst Node</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-1.5 hover:bg-red-100 rounded-8 text-negative transition-colors border-2 border-transparent hover:border-negative"
          title="Logout Sequence"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
