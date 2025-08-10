import { RDispatch } from "@/common-types";
import { Stack as ImmutableStack } from "immutable";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useTargetAndActualWeight(
  serverTarget: number,
  serverActual: number | null,
  targetToActual: (target: number) => number,
  onActualChange: ((value: number | null) => void) | undefined,
  onTargetChange: ((value: number) => void) | undefined,
) {
  const [actual, setActual] = useState(
    serverActual ?? targetToActual(serverTarget),
  );
  const [target, setTarget] = useState(serverTarget);

  const [actualHistory, setActualHistory] = useState(ImmutableStack<number>());

  const setActualWithHistory: RDispatch<number> = useCallback((setState) => {
    setActual((old) => {
      const nu = typeof setState === "function" ? setState(old) : setState;
      setActualHistory((o) => o.push(old));
      return nu;
    });
  }, []);

  const undoDisabled = useMemo(() => actualHistory.size === 0, [actualHistory]);

  const undo = useCallback(() => {
    setActualHistory((history) => {
      if (history.size <= 1) {
        return history;
      }
      const nuHistory = history.pop();
      const prev = nuHistory.peek()!;
      setActual((_) => prev);
      return nuHistory;
    });
  }, []);

  const resetToResolvedTarget = useCallback(() => {
    if (actual === target) {
      return;
    }
    setActualWithHistory(targetToActual(target));
  }, [actual, setActualWithHistory, target, targetToActual]);

  const resetDisabled = useMemo(() => actual === target, [actual, target]);

  useEffect(() => {
    onActualChange?.(actual);
  }, [actual, onActualChange]);

  useEffect(() => {
    onTargetChange?.(target);
  }, [target, onTargetChange]);

  return {
    actual,
    setActual: setActualWithHistory,
    target,
    setTarget,
    undo,
    undoDisabled,
    resetToResolvedTarget,
    resetDisabled,
  };
}
