import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import * as rrd from "react-router-dom";
import CatchError from "./components/CatchError";
import * as c from "./constants";
import { useSelector } from "./types";

interface HideLink extends rrd.LinkProps {
  className?: string;
}

const Layout: React.FC<{}> = ({ children }) => {
  const location = useLocation();
  const [navActive, setNavActive] = React.useState(false);
  const auth = useSelector((a) => a.auth);
  const hideNav = React.useCallback(() => {
    setNavActive(false);
  }, []);
  const signOut = React.useCallback(() => {
    auth.signOut();
    setNavActive(false);
  }, [auth]);

  const HideLink: React.FC<HideLink> = React.useCallback(
    ({ to, children, className }) => {
      let classNamePlus = className;
      if (location.pathname === to) {
        classNamePlus += " bold";
      }
      return (
        <Link className={classNamePlus} to={to} onClick={hideNav}>
          {children}
        </Link>
      );
    },
    [hideNav, location]
  );

  return (
    <>
      <nav
        className="navbar is-fixed-top has-background-primary"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="nav-inner">
          <div className="navbar-brand">
            <div className="flex flex-wrap flex-center main-heading">
              <HideLink to="/" className="title flex flex-wrap flex-center">
                <img src={c.images.dumbbell} width="50" alt="" />
                Weight Training
              </HideLink>
            </div>

            <div
              role="button"
              className={`navbar-burger burger ${navActive &&
                "is-active"} test-nav-button`}
              aria-label="menu"
              aria-expanded={navActive}
              data-target="navbarBasicExample"
              onClick={() => {
                setNavActive((old) => !old);
              }}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </div>
          </div>
          <div className={`navbar-menu ${navActive && "is-active"}`}>
            <div className="navbar-end">
              <div className="navbar-dropdown" onClick={hideNav}>
                <HideLink className="navbar-item" to="/">
                  Home
                </HideLink>
                <HideLink className="navbar-item" to="/records">
                  Records
                </HideLink>
                <HideLink
                  className="navbar-item test-settings-link"
                  to="/settings"
                >
                  Settings
                </HideLink>
                <div className="navbar-item">
                  <button
                    onClick={signOut}
                    className="button is-danger is-small"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="content">
        <CatchError>
          <>{children}</>
        </CatchError>
      </div>
      <footer className="footer">
        <div>
          <strong>Weight Training</strong> by{" "}
          <a href="https://github.com/diminishedprime">Matt Hamrick</a> v
          {process.env.REACT_APP_VERSION}
        </div>
      </footer>
    </>
  );
};
export default Layout;
