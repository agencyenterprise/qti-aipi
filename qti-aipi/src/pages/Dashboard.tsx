import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import {
  DocumentTextIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { tests } = useSelector((state: RootState) => state.assessments);
  const { items } = useSelector((state: RootState) => state.questionBank);

  const stats = [
    {
      name: 'Total Assessments',
      value: tests.length,
      icon: DocumentTextIcon,
      href: '/assessments',
    },
    {
      name: 'Question Bank Items',
      value: items.length,
      icon: BookOpenIcon,
      href: '/question-bank',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 hover:shadow-md transition-shadow duration-200"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {tests.slice(0, 5).map((test) => (
              <li key={test.id}>
                <Link
                  to={`/assessments/${test.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <p className="ml-2 truncate text-sm font-medium text-primary-600">
                          {test.title}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <p>Recently modified</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {test.description || 'No description'}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 