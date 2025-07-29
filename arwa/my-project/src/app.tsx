import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                {/* Add more routes here as needed */}
            </Switch>
        </Router>
    );
};

export default App;