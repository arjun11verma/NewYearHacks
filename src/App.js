import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Bowlpage from './Bowlpage';
import Homepage from './Homepage';
import Loginpage from './Loginpage';
import Createaccountpage from './Createaccountpage';
import Questionpage from './Questionpage';
import Settings from './Settings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path = "/Homepage/:id/Settings" component = {Settings}/>
        <Route path = "/Homepage/:id/Questionpage" component = {Questionpage}/>
        <Route path = "/Homepage/:id/Bowlpage" component = {Bowlpage}/>
        <Route path = "/Homepage/:id" component = {Homepage}/>
        <Route path = "/CreateAccount" component = {Createaccountpage}/>
        <Route path = "/" component = {Loginpage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
