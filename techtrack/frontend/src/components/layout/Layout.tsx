import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import FloatingActionButton, { FabIcons } from '../ui/FloatingActionButton';
import Modal, { ModalFooter } from '../ui/Modal';
import { useAppSelector } from '../../store/hooks';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // FAB Actions
  const fabItems = [
    {
      label: 'Создать акт',
      icon: FabIcons.CreateReport,
      onClick: () => {
        openModal('Создание акта', (
          <div>
            <p className="text-sm mb-3">Выберите тип акта:</p>
            <div className="space-y-2">
              <button className="w-full text-left p-2 border border-gray-300 rounded-md text-sm hover:bg-primary-50">
                Акт выполненных работ
              </button>
              <button className="w-full text-left p-2 border border-gray-300 rounded-md text-sm hover:bg-primary-50">
                Акт технического обслуживания
              </button>
              <button className="w-full text-left p-2 border border-gray-300 rounded-md text-sm hover:bg-primary-50">
                Акт дефектации
              </button>
            </div>
          </div>
        ));
      }
    },
    {
      label: 'Отчет о поломке',
      icon: FabIcons.ReportIssue,
      onClick: () => {
        navigate('/reports/new');
      }
    },
    {
      label: 'Добавить задачу',
      icon: FabIcons.AddTask,
      onClick: () => {
        navigate('/tasks/new');
      }
    },
    {
      label: 'Запчасти',
      icon: FabIcons.Parts,
      onClick: () => {
        navigate('/parts');
      }
    }
  ];

  // Check if we're on the home page to render the appropriate header
  const isHomePage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <main className="flex-grow pb-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <FloatingActionButton items={fabItems} />

      {/* Sidebar (shown when open) */}
      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        footer={<ModalFooter onCancel={closeModal} />}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default Layout;