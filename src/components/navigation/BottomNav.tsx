import { Home, Activity, BarChart2, Book } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Habits', path: '/habits' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
    { icon: Book, label: 'FlexBook', path: '/flexbook' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between py-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center px-3 py-2 text-xs ${
                location.pathname === path
                  ? 'text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
