import * as React from 'react';
import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './utils/auth';
import { RootPage } from './pages/RootPage';
import { LoginPage } from './pages/LoginPage';
import { WorldPage } from './pages/WorldPage';
import { LogoutPage } from './pages/LogoutPage';
import core from './utils/core';

export default function App() {
  useEffect(() => {
    core.socket.connect();
    core.socket.on('connect', () => {
      core.socket.emit('message', { payload: 'hello!' });

      core.socket.on('message', (message) => {
        console.log(message);
      });
    });

    return () => {
      core.socket.off('connect');
    };
  }, []);
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Outlet />}>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/world"
            element={
              <RequireAuth>
                <WorldPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
