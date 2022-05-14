import * as React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './utils/auth';
import { RootPage } from './pages/RootPage';
import { LoginPage } from './pages/LoginPage';
import { WorldPage } from './pages/WorldPage';
import { LogoutPage } from './pages/LogoutPage';
import { EncounterPage } from './pages/EncounterPage';

export default function App() {
  return (
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
        <Route
          path="/encounter"
          element={
            <RequireAuth>
              <EncounterPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
