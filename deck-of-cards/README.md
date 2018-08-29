This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## What is this?
It's a demonstration of service worker + background syncing.
* a react web application ...
* the app fetches from a public API: a randomly-chosen hand of playing cards from https://deckofcardsapi.com
* each new hand of cards is saved to IndexDB and a background sync notification is triggered
* the service worker picks up the notification and posts from IndexDB to a backend 'card server' *when online*
* the back end server just console logs what it receives and responds with a 200 OK.

### The cunning bits
* mobx is used as the react store, which follows an observer pattern
* a change to the hand of cards is observed by `BackgroundSync` (which *isn't* a react component) and a sync is triggered
* there is a custom `service-worker.js` that's built by webpack into the build directory
* background sync will resume as soon as the app becomes back online - automatically

This leans heavily on webpack to build for the browser.

### Lessons learned
* the default service worker built by the react scripts is a complete bastard to customise
* so much so that there is a separate build step to overwrite it completely with a custom (and far simpler though probably less robust) service worker
* this does *not* require ejecting from react's environment (though it would also work if you did, which is probably a good thing)

### Why cards?
There is no magic about the deck of cards API but it does have some useful properties.
* it's a public API in a different web origin
* it has nice cacheable resources like PNGs of the cards themselves
* it is randomised so caching can be checked
* the data size is neither trivial nor overwhelming - get a random deck x 52 cards
* it's free and officially so :-)

## Running the thing
The service worker stuff only works in production builds. A direct sync kicks in for development builds.

### Back end
```
cd card-server
yarn
yarn start
```

### Front end
```
cd deck-of-cards
yarn
yarn build
yarn serve
```

Visit http://localhost:5000 in Chrome. 

Your mileage may vary with your network address - service worker normally wants a HTTP**S** site, but an exception is made for localhost.

Your mileage may also vary by browser.
* Chrome 68.0.3440.106 ==> all good
* Safari 11.1.2 ==> caching works, sync doesn't
* no other browsers tested.
