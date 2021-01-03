import React from "react";
import { NavLink, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";

function LogOutButton() {
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.logout()).then(() => <Redirect to="/" />);
  };
  return <button onClick={handleLogout}>Logout</button>;
}

function NavBar({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ul>
        <li>
          <NavLink to="/journal">Journal</NavLink>
        </li>
        <li>
          <NavLink to="/goals">Goals</NavLink>
        </li>
        <li>
          <NavLink to="/meetings">Meetings</NavLink>
        </li>
        <li>
          <NavLink to="/profile">My Profile</NavLink>
        </li>
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>

        <LogOutButton />
      </ul>
    );
  } else {
    sessionLinks = null;
  }
  return (
    <ul>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
        {isLoaded && sessionLinks}
      </li>
    </ul>
  );
}

export default NavBar;
