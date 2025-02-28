// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  position?: string;
  phone?: string;
  city?: string;
  specialization?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// Task types
export type TaskPriority = 'низкий' | 'средний' | 'высокий';
export type TaskStatus = 'новая' | 'назначена' | 'в работе' | 'выполнена' | 'отменена';
export type DateType = 'fixed' | 'nextService';

export interface Task {
  id: number;
  title: string;
  description?: string;
  city: string;
  location: string;
  priority: TaskPriority;
  status: TaskStatus;
  date_type: DateType;
  due_date?: string;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  equipment_id?: number;
  equipment?: Equipment;
  assigned_to_id?: number;
  assigned_to?: User;
  created_by_id: number;
  created_by?: User;
  trip_id?: number;
  trip?: Trip;
  reports?: Report[];
}

// Equipment types
export type EquipmentStatus = 'Рабочий' | 'Требует ТО' | 'В ремонте';

export interface Equipment {
  id: number;
  name: string;
  model: string;
  serial_number: string;
  manufacturer: string;
  year?: number;
  city: string;
  location: string;
  organization?: string;
  address?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  status: EquipmentStatus;
  working_hours: number;
  max_energy?: string;
  warranty_expiry?: string;
  notes?: string;
  installed_at?: string;
  last_service?: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  parts?: Part[];
  reports?: Report[];
}

// Part types
export type PartStatus = 'В наличии' | 'Заказано' | 'Требуется';

export interface Part {
  id: number;
  name: string;
  article_number: string;
  equipment_type: string;
  compatible_years?: string;
  quantity: number;
  status: PartStatus;
  equipment_id?: number;
  equipment?: Equipment;
  created_at: string;
  updated_at: string;
}

// Report types
export type ReportType = 'Акт выполненных работ' | 'Акт ТО' | 'Отчет о поломке' | 'Ежемесячный отчет';

export interface Report {
  id: number;
  title: string;
  content: string;
  type: ReportType;
  created_at: string;
  updated_at: string;
  task_id?: number;
  task?: Task;
  equipment_id?: number;
  equipment?: Equipment;
  created_by_id: number;
  created_by?: User;
  file_url?: string;
}

// Trip types
export interface Trip {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  city: string;
  description?: string;
  status: 'Запланирована' | 'В процессе' | 'Завершена' | 'Отменена';
  created_at: string;
  updated_at: string;
  user_id: number;
  user?: User;
  tasks?: Task[];
}

// Knowledge types
export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by_id: number;
  created_by?: User;
  file_url?: string;
}

// Weather types
export interface WeatherData {
  day: string;
  temp: string;
  icon: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}