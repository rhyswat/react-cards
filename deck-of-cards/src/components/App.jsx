import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import AppContainer from './AppContainer';
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

class App extends Component {
  render() {
    return (
      <Provider cardStore={cardStore} >
        <AppContainer />
      </Provider>
    );
  }
}

export default App;
