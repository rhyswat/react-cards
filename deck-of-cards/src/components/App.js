import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// components n style
import NavBar from './NavBar';
import CardGame from './CardGame';
import About from './About';
import '../css/App.css';

// stores n stuff
import { Provider } from 'mobx-react';
import CardStore from '../store/CardStore';
import CardsAPI from '../api/CardsAPI';
import { DirectSync, ServiceWorkerSync } from '../helpers/BackgroundSync';

const api = new CardsAPI();
const cardStore = new CardStore(api);

if (process.env.NODE_ENV === 'development') {
  DirectSync(cardStore);
}

if (process.env.NODE_ENV === 'production') {
  ServiceWorkerSync(cardStore);
}

// The top-level element in our application.
// This has to contain the provider and the browser router.
class App extends Component {
  render() {
    return (
      <Provider cardStore={cardStore} >
        <BrowserRouter>
          <div>
            <NavBar />
            <div className="Main">
              <Switch>
                <Route exact path="/cards" component={CardGame} />
                <Route exact path='/about' component={About} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
