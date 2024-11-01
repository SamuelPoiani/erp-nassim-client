'use client';

import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Settings, Menu, Sidebar as SidebarIcon, Bell, Mail, Calendar, User, FileText, Users, Home, ChevronDown, Power } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, loading } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isIconOnly, setIsIconOnly] = useState(false);

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const navigation = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Posts', href: '/dashboard/posts' },
    { icon: <Users size={20} />, label: 'Users', href: '/dashboard/users' },
    { icon: <Mail size={20} />, label: 'Newsletter', href: '/dashboard/newsletter' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed md:static bg-[#283046] text-white ${isIconOnly ? 'w-17' : 'w-64'} min-h-screen p-4 
          transition-all duration-200 ease-in-out z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
              >
                <Menu size={24} />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsIconOnly(!isIconOnly)}
                className="hidden md:flex"
                title={isIconOnly ? "Expand sidebar" : "Collapse sidebar"}
              >
                <SidebarIcon size={20} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Calendar size={20} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User size={20} />
                    <span>{user.name}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer' asChild>
                      <Link href="/dashboard/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
                    <Power className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
