import * as React from "react";
import * as firebase from "firebase/app";
import * as hooks from "./hooks";
import { Link } from "react-router-dom";

const Layout: React.FC<{}> = ({ children }) => {
  const user = hooks.useForceSignIn();
  const [navActive, setNavActive] = React.useState(false);
  const signOut = React.useCallback(() => {
    firebase.auth().signOut();
  }, []);
  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      <nav
        className="navbar is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link to="/">
            <div className="title">Weight Training</div>
          </Link>

          <a
            role="button"
            className={`navbar-burger burger ${navActive && "is-active"}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => {
              setNavActive(old => !old);
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={`navbar-menu ${navActive && "is-active"}`}>
          <div className="navbar-end">
            <div className="navbar-item">
              <a className="button is-primary" onClick={signOut}>
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </>
  );
};
export default Layout;
