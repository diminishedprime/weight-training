import * as React from "react";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import * as t from "./types";

const Layout: React.FC<{}> = ({ children }) => {
  const [navActive, setNavActive] = React.useState(false);
  const signOut = React.useCallback(() => {
    firebase.auth().signOut();
  }, []);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/">
            <div className="title">Weight Training</div>
          </Link>

          <a
            role="button"
            className={`navbar-burger burger ${navActive && "is-active"}`}
            aria-label="menu"
            aria-expanded={navActive}
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
            <div className="navbar-dropdown">
              <Link className="navbar-item" to="/">
                Home
              </Link>
              {Object.values(t.LiftType).map(liftType => {
                return (
                  <Link
                    key={`lift/${liftType}`}
                    className="navbar-item"
                    to={`/lift/${liftType}`}
                  >
                    {liftType}
                  </Link>
                );
              })}
              <button onClick={signOut} className="button is-danger is-small">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="content">{children}</div>
      <footer className="footer">
        <div>
          <strong>Weight Training</strong> by{" "}
          <a href="https://github.com/diminishedprime">Matt Hamrick</a> v
          {process.env.REACT_APP_VERSION}
        </div>
        <div>
          Icons by <a href="https://icons8.com">icons8</a>
        </div>
      </footer>
    </>
  );
};
export default Layout;
