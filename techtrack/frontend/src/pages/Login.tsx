import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
  rememberMe: Yup.boolean(),
});

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormValues = {
    username: '',
    password: '',
    rememberMe: false,
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context and displayed below
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">TechTrack</h1>
            <p className="text-gray-600 mt-2">Войдите в свою учетную запись</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Имя пользователя
                  </label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Введите имя пользователя"
                      leftIcon={<User size={18} className="text-gray-400" />}
                      error={touched.username && errors.username}
                      fullWidth
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите пароль"
                      leftIcon={<Lock size={18} className="text-gray-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      error={touched.password && errors.password}
                      fullWidth
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Запомнить меня
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Забыли пароль?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Войти
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Нет учетной записи?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700">
                Зарегистрироваться
              </Link>
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} TechTrack. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;