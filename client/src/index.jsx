import React from 'react';
import { render } from 'react-dom';
import {
  HashRouter as Router,
  Route,
  IndexRoute,
  Link,
  hashHistory
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';
import { applyMiddleware, createStore } from 'redux';
import { logger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import NavBar from './components/NavBar.jsx';
import Home from './components/Home.js';
import reducer from './reducers/index.jsx';
import Auctions from './components/Auctions.jsx';
import Auction from './components/Auction.jsx';
import Artists from './components/Artists.jsx';
import Artist from './components/Artist.jsx';
import Events from './components/Events.jsx';
import SignUp from './components/SignUp.jsx';
import LogIn from './components/LogIn.jsx';
import CreateAuction from './components/CreateAuction.jsx';
import Notification from './components/Notification.jsx';

const middleware = applyMiddleware(thunkMiddleware, logger);

//preloadedState in between reducer and middleware is optional
const store = createStore(reducer, middleware
  //the following line is for redux devtools, but adding it leads to logger malfunction
  // , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

//need to have a route for finished auctions that can't be bid
const Index = () => {
    return (
      <Router>
        <Container>
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route path="/auctions" component={Auctions} />
          <Route path="/auction/:auctionId" component={Auction} />
          <Route path="/artists" component={Artists} />
          <Route path="artist/:artistId" component={Artist} />
          <Route path="/events" component={Events} />
          <Route path="/login" component={LogIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/notification" component={Notification} />
          <Route path="/createAuction" component={CreateAuction} />
        </Container>
      </Router>
    )
}

render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('root')
);
