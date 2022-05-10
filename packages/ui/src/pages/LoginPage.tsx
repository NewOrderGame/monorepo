import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../utils/auth';
import core from '../utils/core';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const sessionId = window.localStorage.getItem('sessionId');
    if (sessionId) {
      core.auth.auth = { sessionId };
      core.auth.connect();

      core.auth.on('get-username', ({ username }) => {
        if (username) {
          auth.logIn({ username }, () => {
            navigate('/world', { replace: true });
          });
        } else {
          window.localStorage.removeItem('sessionId');
          window.localStorage.removeItem('userId');
          window.localStorage.removeItem('username');
        }
      });
    }
    return () => {
      core.auth.off('connect');
      core.auth.off('get-username');
    };
  }, [auth, navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    auth.logIn({ username }, () => {
      navigate('/world', { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
