'use client';

import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineBell, HiOutlineMail, HiOutlineCalendar, HiOutlineUser, HiOutlineChevronDown } from 'react-icons/hi';
import { FiHome, FiFileText, FiUsers, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isIconOnly, setIsIconOnly] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const navigation = [
    { icon: <FiHome size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FiFileText size={20} />, label: 'Posts', href: '/dashboard/posts' },
    { icon: <FiUsers size={20} />, label: 'Users', href: '/dashboard/users' },
    { icon: <HiOutlineMail size={20} />, label: 'Newsletter', href: '/dashboard/newsletter' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 h-screen bg-[#283046] text-white ${
          isIconOnly ? 'w-17' : 'w-64'
        } p-4 transition-all duration-200 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className={`flex items-center p-2 mb-8 ${isIconOnly ? 'justify-center' : ''}`}>
          <img 
            src={isIconOnly 
              ? "https://raw.githubusercontent.com/Nassim-Tecnologia/brand-assets/refs/heads/main/logo-light-without-bg.png"
              : "https://raw.githubusercontent.com/Nassim-Tecnologia/brand-assets/refs/heads/main/logo-marca-primary-without-bg.png"
            }
            alt="Logo" 
            className={`${isIconOnly ? 'h-10 w-10' : 'h-8'}`} 
          />
        </div>
        <nav>
          <ul className="space-y-2">
            {navigation.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={`flex items-center ${isIconOnly ? 'justify-center' : ''} p-2 rounded-lg hover:bg-[#161d31] ${
                    isIconOnly ? 'px-2' : 'space-x-3'
                  }`}
                  title={isIconOnly ? item.label : ''}
                >
                  {item.icon}
                  {!isIconOnly && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <HiOutlineMenu size={20} />
              </button>
              <button
                onClick={() => setIsIconOnly(!isIconOnly)}
                className="p-2 rounded-lg hover:bg-gray-100 hidden md:block"
              >
                <HiOutlineMenu size={20} />
              </button>
            </div>

            {/* Right side navbar items */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <HiOutlineBell size={20} />
              </button>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <HiOutlineUser size={20} />
                  </div>
                  <span>{user.name}</span>
                  <HiOutlineChevronDown size={16} />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
