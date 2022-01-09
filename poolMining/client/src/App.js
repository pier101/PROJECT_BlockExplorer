import React ,{Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar'

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar>
        <div>
          <Switch>
          <p>ed</p>

          </Switch>
        </div>
      </NavBar>
    </Suspense>
  );
}

export default App;
