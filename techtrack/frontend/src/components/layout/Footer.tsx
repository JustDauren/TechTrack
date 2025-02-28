import React from 'react';
import { Home, Calendar, Wrench, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path ||
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="bg-white shadow-inner p-2 flex justify-around fixed bottom-0 left-0 right-0">
      <button
        className={`flex flex-col items-center p-1 ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => navigate('/')}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Главная</span>
      </button>
      <button
        className={`flex flex-col items-center p-1 ${isActive('/tasks') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => navigate('/tasks')}
      >
        <Calendar size={20} />
        <span className="text-xs mt-1">Задачи</span>
      </button>
      {/* Empty div for center space (where FAB will be) */}
      <div className="w-12"></div>
      <button
        className={`flex flex-col items-center p-1 ${isActive('/equipment') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => navigate('/equipment')}
      >
        <Wrench size={20} />
        <span className="text-xs mt-1">Оборудование</span>
      </button>
      <button
        className={`flex flex-col items-center p-1 ${isActive('/parts') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => navigate('/parts')}
      >
        <Package size={20} />
        <span className="text-xs mt-1">Запчасти</span>
      </button>
    </div>
  );
};

export default Footer;