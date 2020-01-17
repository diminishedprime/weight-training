import firebase from "firebase/app";
import * as React from "react";
import * as t from "../types";

interface ErrorBoundaryProps {
  readonly children: JSX.Element | JSX.Element[];
}

interface ErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public readonly state: ErrorBoundaryState = {
    error: undefined,
    errorInfo: undefined
  };

  public componentDidCatch(error: any, errorInfo: any) {
    firebase.analytics().logEvent("exception", {
      description: error && error.toString(),
      fatal: true,
      errorInfo
    });
    this.setState({
      error,
      errorInfo
    });
  }

  public clearLocalStorage() {
    const user = window.localStorage.getItem(t.LocalStorageKey.USER);
    window.localStorage.clear();
    if (user !== null) {
      window.localStorage.setItem(t.LocalStorageKey.USER, user);
    }
  }

  public render() {
    const { error, errorInfo } = this.state;
    if (errorInfo) {
      const errorDetails =
        process.env.NODE_ENV === "development" ? (
          <details className="preserve-space">
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
        ) : (
          undefined
        );
      return (
        <div>
          <h2 className="error title">An unexpected error has occurred.</h2>
          {errorDetails}
          <button className="button is-danger" onClick={this.clearLocalStorage}>
            Clear Local Storage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
