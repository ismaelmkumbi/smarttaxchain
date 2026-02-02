import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layouts/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('src/views/authentication/auth1/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />,
    },
  ],
};

export default LoginRoutes;
