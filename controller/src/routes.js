import React from 'react';
import Dashboard from './views/Dashboard';
import ChangePassword from './views/Pages/ChangePassword';
import History from './views/History';
import BusinessDirectories from './views/Pages/BusinessDirectories/BusinessDirectories';
 
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/history', name: 'History', component: History },
  { path: '/changePassword', name: 'Change-Password', component: ChangePassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {path:'/businessdirectories',name:'Business Directories',component:BusinessDirectories}
];

export default routes;
