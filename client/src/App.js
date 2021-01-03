import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage";
import LoginFormPage from "./components/Login";
import SignupFormPage from "./components/Signup";
import Journal from "./components/Journal";
import Goals from "./components/Goals";
import Meetings from "./components/Meetings";
import ProfilePage from "./components/ProfilePage";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import NavBar from "./components/Navigation";

const App = withRouter(({ location }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    isLoaded && (
      <>
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/signup" && <NavBar />}
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={LoginFormPage} />
        <Route path="/signup" component={SignupFormPage} />
        <Route path="/journal" component={Journal} />
        <Route path="/goals" component={Goals} />
        <Route path="/meetings" component={Meetings} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={Settings} />
        <Route path="/dashboard" component={Dashboard} />
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/signup" && <Footer />}
      </>
    )
  );
});

export default App;
