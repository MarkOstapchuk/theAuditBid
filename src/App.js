import Header from "./components/Header/Header";
import React from "react";
import Footer from "./components/Footer";
import {BrowserRouter} from "react-router-dom";
import Router from "./router/Router.js";
import {Provider} from "react-redux";
import store from "./redux/Store";

function App() {

  return (
      <BrowserRouter>
          <Provider store={store}>
          <Header/>
          <Router />
          <Footer/>
          </Provider>
      </BrowserRouter>
  );
}

export default App;
