import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { ConnectionProvider } from './lib/connection';
import './lib/types';
import styled from 'styled-components';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Cover = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('cover.jpg');
  background-size: cover;
  background-position: center;
`;

root.render(
  <Cover>
    <Authenticator loginMechanisms={['email']} signUpAttributes={['nickname']}>
      <BrowserRouter>
        <ConnectionProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ConnectionProvider>
      </BrowserRouter>
    </Authenticator>
  </Cover>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
