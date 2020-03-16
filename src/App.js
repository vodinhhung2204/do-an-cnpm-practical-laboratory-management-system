import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import { connect } from "react-redux";
import { messaging } from "./init-fcm";
import fire from "../src/config/fire";

const firebase = require("firebase");
const storage = firebase.storage();
// Required for side-effects
require("firebase/firestore");

var db = fire.firestore();
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
// ...
class App extends Component {
  async componentDidMount() {

    const mssv = localStorage.getItem("DataUser") ? localStorage.getItem("DataUser") : "";
    messaging.onMessage((payload) => console.log('Message received. ', payload));
    messaging.requestPermission()
      .then(async function () {
        const token = await messaging.getToken();
        console.log("DAY LA sTO KEN", token)
        if (mssv !== "") {
          await db.collection("students").doc(mssv).update({
            tokenWeb: token
          })
        }

      })
    navigator.serviceWorker.addEventListener("message", (message) => console.log(message));
    if (mssv !== '') {
      return (
        <Redirect to='/login' />

      )

    }
  }
  render() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
      } else {
        console.log('Unable to get psermission to notify.');
      }
    });
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
            <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


const mapStateToProps = DataInStore => {
  return {
    dataUser: DataInStore.user
  };
};

export default connect(
  mapStateToProps,
  null
)(App);
