import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import TaskDashboard from './pages/TaskDashboard';
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/tasks" component={TaskDashboard} />
      </Switch>
    </Router>
  );
};
export default App;
