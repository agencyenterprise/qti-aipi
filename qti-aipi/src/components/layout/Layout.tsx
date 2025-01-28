import { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  HomeIcon,
  DocumentTextIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Assessments', href: '/assessments', icon: DocumentTextIcon },
    { name: 'Question Bank', href: '/question-bank', icon: BookOpenIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">QTI Assessment</h1>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1 text-gray-500 hover:text-gray-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 mb-1 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-margin duration-200 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Top navigation */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1 text-gray-500 hover:text-gray-900"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 