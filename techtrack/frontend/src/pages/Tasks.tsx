import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Calendar, Clock, ArrowRight, MoreHorizontal, Map } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTasks } from '../store/slices/tasksSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Task, DateType } from '../types';

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tasks, loading } = useAppSelector(state => state.tasks);
  const { city: currentCity, availableCities } = useAppSelector(state => state.ui);

  const [showAllCities, setShowAllCities] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [dateTypeFilter, setDateTypeFilter] = useState<DateType | 'all'>('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Filter tasks based on city and date type
  const filteredTasks = tasks.filter(task => {
    // Filter by city
    if (!showAllCities && task.city !== currentCity) {
      return false;
    }

    // Filter by date type
    if (dateTypeFilter !== 'all' && task.date_type !== dateTypeFilter) {
      return false;
    }

    return true;
  });

  // Group tasks by city when showing all cities
  const tasksByCity = showAllCities
    ? availableCities.reduce<{ [city: string]: Task[] }>((acc, city) => {
        acc[city] = filteredTasks.filter(task => task.city === city);
        return acc;
      }, {})
    : { [currentCity]: filteredTasks };

  const TaskForm = () => (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Новая задача</h3>
        <button
          className="text-gray-500"
          onClick={() => setShowTaskForm(false)}
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-xs mb-1">Название задачи</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Например: Калибровка MLC"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-xs mb-1">Город</label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
          {availableCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-xs mb-1">Оборудование</label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
          <option>Выберите оборудование</option>
          {/* Equipment options would be populated here */}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-xs mb-1">Приоритет</label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
          <option value="низкий">Низкий</option>
          <option value="средний">Средний</option>
          <option value="высокий">Высокий</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-xs mb-1">Тип даты</label>
        <div className="flex mb-2">
          <button className="flex-1 bg-primary-600 text-white py-2 rounded-l-md text-xs">Конкретная дата</button>
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-r-md text-xs">Во время следующего ТО</button>
        </div>

        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <Button variant="primary" fullWidth>
        Создать задачу
      </Button>
    </Card>
  );

  // Render task card
  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="mb-3" hover>
      <div className="flex justify-between items-start">
        <div className="font-medium">{task.title}</div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          task.priority === 'высокий' ? 'bg-red-100 text-red-800' : 
          task.priority === 'средний' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {task.priority}
        </span>
      </div>
      <div className="text-sm text-gray-600 mt-1">{task.equipment?.name} ({task.equipment?.serial_number})</div>
      <div className="text-sm text-gray-600 mt-1">{task.location}</div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          {task.date_type === 'fixed' ? (
            <Calendar size={14} className="text-gray-500 mr-1" />
          ) : (
            <Clock size={14} className="text-gray-500 mr-1" />
          )}
          <span className="text-xs text-gray-600">
            {task.date_type === 'fixed'
              ? new Date(task.due_date || '').toLocaleDateString()
              : 'Во время следующего ТО'}
          </span>
        </div>

        <div className="flex space-x-2">
          <button className="text-primary-600 text-xs flex items-center">
            Начать
            <ArrowRight size={12} className="ml-1" />
          </button>
          <button className="text-gray-500">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-3">
      <div className="bg-white p-3 shadow-sm mb-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Задачи</h2>
        <div className="flex items-center">
          <span className="text-gray-500 mr-3"></span>
          <div className="w-6 h-5 flex flex-col justify-center items-center">
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          Добавить
        </Button>
      </div>

      {showTaskForm && <TaskForm />}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${!showAllCities 
              ? 'bg-primary-50 text-primary-600' 
              : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setShowAllCities(false)}
          >
            {currentCity}
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${showAllCities 
              ? 'bg-primary-50 text-primary-600' 
              : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setShowAllCities(true)}
          >
            Все города
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${dateTypeFilter === 'nextService' 
              ? 'bg-primary-50 text-primary-600' 
              : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setDateTypeFilter(dateTypeFilter === 'nextService' ? 'all' : 'nextService')}
          >
            При ТО
          </button>
        </div>
        <button className="text-primary-600 text-sm flex items-center">
          <Filter size={14} className="mr-1" />
          Фильтр
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Загрузка задач...</div>
      ) : showAllCities ? (
        // Tasks grouped by city
        Object.entries(tasksByCity).map(([city, cityTasks]) => (
          cityTasks.length > 0 ? (
            <div key={city} className="mb-4">
              <div className="flex items-center mb-2">
                <Map size={16} className="text-primary-600 mr-2" />
                <h3 className="text-md font-medium">{city}</h3>
              </div>

              {cityTasks.map(task => renderTaskCard(task))}
            </div>
          ) : null
        ))
      ) : (
        // Tasks for current city only
        filteredTasks.length > 0 ? (
          filteredTasks.map(task => renderTaskCard(task))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Нет задач, соответствующих выбранным критериям
          </div>
        )
      )}
    </div>
  );
};

export default Tasks;