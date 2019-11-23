import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import "./App.sass";
import Login from "./Login";
import Home from "./Home";

const firebaseConfig = {
  apiKey: "AIzaSyBBu2D-owaz14CfZvmOqjSoN0oMde5D5NE",
  authDomain: "weight-training-8a1ac.firebaseapp.com",
  databaseURL: "https://weight-training-8a1ac.firebaseio.com",
  projectId: "weight-training-8a1ac",
  storageBucket: "weight-training-8a1ac.appspot.com",
  messagingSenderId: "21223491336",
  appId: "1:21223491336:web:7378ae65a038e84eda8ebd",
  measurementId: "G-4F9TH5XYE6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const App: React.FC = () => {
  const [user, setUser] = React.useState<firebase.User | null>(null);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login setUser={setUser} />
        </Route>
        <Route path="/home" exact>
          <Home user={user} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
