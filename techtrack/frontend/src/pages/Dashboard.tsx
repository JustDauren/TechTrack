import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Wrench, Sun, Cloud, CloudRain, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchEquipment } from '../store/slices/equipmentSlice';
import Card from '../components/ui/Card';
import { Task, Equipment, WeatherData } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);
  const { city: currentCity } = useAppSelector(state => state.ui);
  const { tasks, loading: tasksLoading } = useAppSelector(state => state.tasks);
  const { equipment, loading: equipmentLoading } = useAppSelector(state => state.equipment);

  // Mock weather data (would come from API in real app)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    { day: 'Сегодня', temp: '22°C', icon: 'sun' },
    { day: 'Завтра', temp: '20°C', icon: 'sun' },
    { day: 'Пт', temp: '18°C', icon: 'cloud' },
    { day: 'Сб', temp: '17°C', icon: 'cloud-rain' },
    { day: 'Вс', temp: '19°C', icon: 'cloud' }
  ]);

  // Filter tasks for current city
  const cityTasks = tasks.filter(task => task.city === currentCity);

  // Filter equipment for current city
  const cityEquipment = equipment.filter(eq => eq.city === currentCity);

  useEffect(() => {
    // Fetch tasks and equipment when the component mounts
    dispatch(fetchTasks());
    dispatch(fetchEquipment());
  }, [dispatch]);

  // Function to render weather icon
  const renderWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun size={20} className="text-yellow-500" />;
      case 'cloud':
        return <Cloud size={20} className="text-gray-500" />;
      case 'cloud-rain':
        return <CloudRain size={20} className="text-blue-500" />;
      default:
        return <Sun size={20} className="text-yellow-500" />;
    }
  };

  // Безопасное отображение данных оборудования
  const renderEquipmentInfo = (equipment: Equipment | string | undefined) => {
    if (!equipment) return 'Не указано';

    // Если equipment - это объект с нужными свойствами
    if (typeof equipment === 'object' && 'name' in equipment && 'serial_number' in equipment) {
      return `${equipment.name} (${equipment.serial_number})`;
    }

    // Если equipment - это строка (ID или название)
    if (typeof equipment === 'string') {
      return equipment;
    }

    return 'Не указано';
  };

  return (
    <div className="p-3">
      {/* Weather forecast */}
      <Card className="mb-3">
        <h3 className="text-sm font-medium mb-2">Прогноз погоды в {currentCity}</h3>
        <div className="flex justify-between">
          {weatherData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs mb-1">{day.day}</div>
              {renderWeatherIcon(day.icon)}
              <div className="text-xs mt-1">{day.temp}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming tasks in current city */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="text-primary-600 mr-2" size={18} />
            <h2 className="font-medium">Предстоящие задачи</h2>
          </div>
          <button
            className="text-primary-600 text-xs"
            onClick={() => navigate('/tasks')}
          >
            Все задачи →
          </button>
        </div>

        {tasksLoading ? (
          <div className="text-center py-3 text-gray-500">Загрузка...</div>
        ) : cityTasks.length > 0 ? (
          cityTasks.slice(0, 2).map(task => (
            <div
              key={task.id}
              className="mb-3 border-l-3 border-primary-500 pl-2 py-1"
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="font-medium text-sm">{task.title}</div>
              {/* Безопасное отображение данных оборудования */}
              <div className="text-xs text-gray-600">{renderEquipmentInfo(task.equipment)}</div>
              <div className="text-xs text-gray-600 flex justify-between">
                <span>{task.location}</span>
                <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Не указано'}</span>
              </div>
              <div className="text-xs mt-1">
                <span className={`px-2 py-1 rounded-full ${
                  task.priority === 'высокий' ? 'bg-red-100 text-red-800' : 
                  task.priority === 'средний' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-gray-500">
            <p>Нет задач в городе {currentCity}</p>
            <button
              className="mt-2 text-primary-600 text-sm flex items-center justify-center mx-auto"
              onClick={() => navigate('/tasks/new')}
            >
              <Plus size={16} className="mr-1" />
              Добавить задачу
            </button>
          </div>
        )}
      </Card>

      {/* Equipment in city */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Wrench className="text-primary-600 mr-2" size={18} />
            <h2 className="font-medium">Оборудование в {currentCity}</h2>
          </div>
          <button
            className="text-primary-600 text-xs"
            onClick={() => navigate('/equipment')}
          >
            Все аппараты →
          </button>
        </div>

        {equipmentLoading ? (
          <div className="text-center py-3 text-gray-500">Загрузка...</div>
        ) : cityEquipment.length > 0 ? (
          cityEquipment.map(equipment => (
            <div
              key={equipment.id}
              className="mb-2 py-1 flex justify-between items-center"
              onClick={() => navigate(`/equipment/${equipment.id}`)}
            >
              <div>
                <div className="text-sm font-medium">{equipment.name} ({equipment.serial_number})</div>
                <div className="text-xs text-gray-600">{equipment.location}</div>
              </div>
              <div className="text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  equipment.status.includes('Требует') ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {equipment.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-gray-500">
            <p>Нет оборудования в городе {currentCity}</p>
            <button
              className="mt-2 text-primary-600 text-sm flex items-center justify-center mx-auto"
              onClick={() => navigate('/equipment/new')}
            >
              <Plus size={16} className="mr-1" />
              Добавить оборудование
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;