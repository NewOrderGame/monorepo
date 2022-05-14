import * as React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import core from '../utils/core';
import { useAuth } from '../utils/auth';

export function EncounterPage() {
  console.log('Encounter Page');
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const state = location.state as { encounterId: string; username: string };

  console.log(location.state);

  useEffect(() => {
    if (auth.user) {
      const sessionId = window.localStorage.getItem('sessionId');
      console.log(`Connecting to Encounter`);
      if (sessionId) {
        core.encounter.auth = { sessionId };
        core.encounter.connect();
      } else {
        core.encounter.auth = { username: auth.user?.username };
        core.encounter.connect();
      }

      core.encounter.on('session', ({ sessionId, userId, username, page }) => {
        core.encounter.auth = { sessionId };
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        auth.logIn({ username, page });
      });

      core.encounter.on('logout', () => {
        navigate('/logout');
      });

      core.encounter.on('connect_error', (error) => {
        if (error.message === 'Invalid username') {
          navigate('/logout');
        }
      });

      return () => {
        core.encounter.off('connect');
        core.encounter.off('disconnecting');
        core.encounter.off('disconnect');
        core.encounter.off('session');
        core.encounter.off('logout');
        core.encounter.off('connect_error');
      };
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log('let me out!');
  }

  return (
    <div>
      <h1>You got hit by {state.username}</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">LET ME BACK!</button>
      </form>
    </div>
  );
}
