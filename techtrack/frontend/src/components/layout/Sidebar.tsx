import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  X,
  Plane,
  ClipboardList,
  Coffee,
  BookOpen,
  HelpingHand,
  Settings,
  LogOut
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-30">
      {/* Затемненный фон с блюром */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar menu */}
      <div className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
              <User size={20} />
            </div>
            <div>
              <div className="font-medium">{user?.full_name || user?.username}</div>
              <div className="text-xs text-gray-500">{user?.position || 'Сервисный инженер'}</div>
            </div>
          </div>
          <button
            className="text-gray-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          <div className="space-y-1 mb-6">
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/trips')}
            >
              <Plane size={20} className="text-primary-600 mr-3" />
              <span>Командировки</span>
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/reports')}
            >
              <ClipboardList size={20} className="text-primary-600 mr-3" />
              <span>Отчеты</span>
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/places')}
            >
              <Coffee size={20} className="text-primary-600 mr-3" />
              <span>Места</span>
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/profile')}
            >
              <User size={20} className="text-primary-600 mr-3" />
              <span>Профиль</span>
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/knowledge')}
            >
              <BookOpen size={20} className="text-primary-600 mr-3" />
              <span>База знаний</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-1">
            <button className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50">
              <HelpingHand size={20} className="text-primary-600 mr-3" />
              <span>Помощь</span>
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50"
              onClick={() => handleNavigation('/settings')}
            >
              <Settings size={20} className="text-primary-600 mr-3" />
              <span>Настройки</span>
            </button>
          </div>
        </div>

        <button
          className="mt-4 w-full flex items-center justify-center p-3 rounded-lg text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;