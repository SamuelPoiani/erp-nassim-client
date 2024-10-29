'use client';

import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineUser
} from 'react-icons/ai';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  subItems?: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>('Posts');

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: AiOutlineHome 
    },
    { 
      name: 'Posts', 
      href: '/dashboard/posts', 
      icon: AiOutlineFileText,
      subItems: [
        { 
          name: 'Create', 
          href: '/dashboard/posts/new', 
          icon: AiOutlinePlus 
        }
      ]
    },
    { 
      name: 'Users', 
      href: '/dashboard/users', 
      icon: AiOutlineUser 
    },
    {
      name: 'Newsletter',
      href: '/dashboard/newsletter',
      icon: AiOutlineFileText,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <AiOutlineClose className="h-6 w-6" />
        ) : (
          <AiOutlineMenu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Image
              src="https://raw.githubusercontent.com/Nassim-Tecnologia/brand-assets/refs/heads/main/logo-marca-primary-without-bg.png"
              alt="Logo"
              width={150}
              height={40}
              className="mx-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex items-center flex-1 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                      item.subItems ? 'mr-2' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                  
                  {item.subItems && (
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedItem === item.name ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Sub-items */}
                {item.subItems && expandedItem === item.name && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <subItem.icon className="h-4 w-4 mr-3" />
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`
        transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
