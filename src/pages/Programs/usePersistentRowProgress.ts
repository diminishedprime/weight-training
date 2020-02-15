import React from "react";

const usePersistentRowProgress = <T extends unknown>(
  localStorageKey: string,
  rows: T[],
  finishSection: () => void
) => {
  const currentKey = localStorageKey + "-current";
  const skippedKey = localStorageKey + "-skipped";
  const finishedKey = localStorageKey + "-finished";
  const [current, setCurrent] = React.useState(() => {
    const currentString = window.localStorage.getItem(currentKey);
    if (currentString === null) {
      return 0;
    } else {
      return parseInt(currentString, 0);
    }
  });
  const [skipped, setSkipped] = React.useState<Set<number>>(() => {
    const skippedString = window.localStorage.getItem(skippedKey);
    if (skippedString === null) {
      return new Set();
    } else {
      return new Set(JSON.parse(skippedString));
    }
  });
  const [finished, setFinished] = React.useState<Set<number>>(() => {
    const finishedString = window.localStorage.getItem(finishedKey);
    if (finishedString === null) {
      return new Set();
    } else {
      return new Set(JSON.parse(finishedString));
    }
  });

  React.useEffect(() => {
    if (current < rows.length) {
      window.localStorage.setItem(finishedKey, JSON.stringify([...finished]));
      window.localStorage.setItem(skippedKey, JSON.stringify([...skipped]));
      window.localStorage.setItem(currentKey, current.toString());
    }
  }, [
    finished,
    skipped,
    current,
    currentKey,
    finishedKey,
    skippedKey,
    rows.length
  ]);

  React.useEffect(() => {
    if (current >= rows.length) {
      window.localStorage.removeItem(finishedKey);
      window.localStorage.removeItem(skippedKey);
      window.localStorage.removeItem(currentKey);
      finishSection();
    }
  }, [
    current,
    finishSection,
    currentKey,
    finishedKey,
    skippedKey,
    rows.length
  ]);

  const skipRemaining = React.useCallback(
    (idx: number) => () => {
      setSkipped((old) => {
        for (let i = idx; i <= rows.length; i++) {
          old.add(i);
        }
        return new Set(old);
      });
      setCurrent(rows.length);
    },
    [rows.length, setSkipped, setCurrent]
  );

  const skipLift = React.useCallback(
    (idx: number) => () => {
      setCurrent((old) => old + 1);
      setSkipped((old) => {
        old.add(idx);
        return new Set(old);
      });
    },
    [setCurrent, setSkipped]
  );

  const finishLift = React.useCallback(
    (idx: number, cb: () => void) => () => {
      setCurrent((old) => old + 1);
      setFinished((old) => {
        old.add(idx);
        return new Set(old);
      });
      cb();
    },
    [setCurrent, setFinished]
  );

  return {
    finishLift,
    skipped,
    setSkipped,
    finished,
    setFinished,
    current,
    setCurrent,
    skipRemaining,
    skipLift
  };
};

export default usePersistentRowProgress;
