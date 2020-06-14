import React from 'react';
import Dashboard from './views/Dashboard';
import ChangePassword from './views/Pages/ChangePassword';
import History from './views/History';
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/history', name: 'History', component: History },
  { path: '/changePassword', name: 'Change-Password', component: ChangePassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
];

export default routes;
