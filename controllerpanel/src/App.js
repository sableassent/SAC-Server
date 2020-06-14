import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import DefaultLayout from './containers/DefaultLayout';
import Login from './views/Pages/Login';
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
          <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
