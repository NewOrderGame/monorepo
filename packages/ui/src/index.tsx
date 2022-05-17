import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { ConnectionProvider } from './utils/connection';

if (!process.env.REACT_APP_NOG_USER_POOL_ID) {
  throw new Error('Environment variable REACT_APP_NOG_USER_POOL_ID is missing');
}

if (!process.env.REACT_APP_NOG_USER_POOL_WEB_CLIENT_ID) {
  throw new Error(
    'Environment variable REACT_APP_NOG_USER_POOL_WEB_CLIENT_ID is missing'
  );
}

if (!process.env.REACT_APP_NOG_USER_POOL_REGION) {
  throw new Error(
    'Environment variable REACT_APP_NOG_USER_POOL_REGION is missing'
  );
}

Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_NOG_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_NOG_USER_POOL_WEB_CLIENT_ID,
    region: process.env.REACT_APP_NOG_USER_POOL_REGION
  }
});

console.log('Index');
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Authenticator loginMechanisms={['email']} signUpAttributes={['nickname']}>
    <BrowserRouter>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </BrowserRouter>
  </Authenticator>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
