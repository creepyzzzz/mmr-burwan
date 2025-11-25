import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;