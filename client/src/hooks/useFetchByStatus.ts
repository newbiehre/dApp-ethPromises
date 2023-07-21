import { useState, useEffect } from "react";
import { PromiseEvent, PromiseStatus } from "../utils/contracts/contract-type";

export const useFetchByStatus = (all: PromiseEvent[]) => {
  const [inProgress, setInProgress] = useState<PromiseEvent[]>([]);
  const [completed, setCompleted] = useState<PromiseEvent[]>([]);
  const [failed, setFailed] = useState<PromiseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const update = async () => {
      setIsLoading(true);
      try {
        setInProgress(
          all.filter((i) => i.status === PromiseStatus.IN_PROGRESS)
        );
        setCompleted(all.filter((i) => i.status === PromiseStatus.COMPLETED));
        setFailed(all.filter((i) => i.status === PromiseStatus.FAILED));
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    update();
  }, [all]);

  return {
    inProgress,
    completed,
    failed,
    isLoading,
  };
};
