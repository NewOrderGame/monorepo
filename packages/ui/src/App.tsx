import * as React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { RootPage } from './pages/RootPage';
import { WorldPage } from './pages/WorldPage';
import { EncounterPage } from './pages/EncounterPage';
import { CharacterPage } from './pages/CharacterPage';
import logger from './lib/utils/logger';

const App = () => {
  logger.info('App');

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="/" element={<RootPage />} />
        <Route path="/character" element={<CharacterPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/encounter" element={<EncounterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
