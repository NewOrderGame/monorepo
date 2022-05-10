import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useAuth } from '../utils/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    auth.signIn({ username }, () => {
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
