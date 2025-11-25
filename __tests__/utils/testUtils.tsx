import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <NotificationProvider>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </NotificationProvider>
  );
};

