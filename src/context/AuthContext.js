import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для входа в систему
  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Вход выполнен успешно!');
      return true;
    } catch (error) {
      console.error('Ошибка входа:', error);
      let errorMessage = 'Произошла ошибка при входе';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Неверный email или пароль';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Слишком много попыток входа. Попробуйте позже';
      }
      
      toast.error(errorMessage);
      return false;
    }
  }

  // Функция для выхода из системы
  async function logout() {
    try {
      await signOut(auth);
      toast.success('Выход выполнен успешно');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      toast.error('Ошибка при выходе из системы');
    }
  }

  // Функция для сброса пароля
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Инструкции по сбросу пароля отправлены на ваш email');
      return true;
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      toast.error('Ошибка при отправке инструкций по сбросу пароля');
      return false;
    }
  }

  // Эффект для отслеживания состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 