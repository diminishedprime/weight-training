import * as React from "react";
import * as hooks from "../hooks";

export default () => {
  const update = hooks.useUpdateAvailable();
  const [showToggle, setShowToggle] = React.useState(true);

  const reload = React.useCallback(() => {
    window.location.reload();
  }, []);

  const close = React.useCallback(() => {
    setShowToggle(false);
  }, []);

  return (
    <>
      {update && showToggle && (
        <div className="card update-card">
          <div className="card-content title">An Update is Available!</div>
          <div className="card-footer field is-grouped-right is-grouped">
            <p className="control">
              <button
                className="button is-success is-outlined"
                onClick={reload}
              >
                Update
              </button>
            </p>
            <p className="control">
              <button className="button is-danger" onClick={close}>
                Dismiss
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
