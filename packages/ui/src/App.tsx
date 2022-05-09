import * as React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './utils/auth';
import { RootPage } from './pages/RootPage';
import { LoginPage } from './pages/LoginPage';
import { WorldPage } from './pages/WorldPage';
import { LogoutPage } from './pages/LogoutPage';
import { useEffect } from 'react';
import core from './utils/core';
import { Action } from '@newordergame/common';

export default function App() {
  useEffect(() => {
    core.connect();
    core.send({ action: Action.MOVE, payload: { lat: 40, lng: 50 } });
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
