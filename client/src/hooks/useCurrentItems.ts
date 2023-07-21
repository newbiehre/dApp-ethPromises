import { useState, useEffect } from "react";
import { PromiseEvent } from "../utils/contracts/contract-type";

export const useCurrentItems = (
  all: PromiseEvent[],
  inProgress: PromiseEvent[],
  completed: PromiseEvent[],
  failed: PromiseEvent[],
  activeTab: number,
  allLoading: boolean,
  isStatusLoading: boolean
) => {
  const [currentItems, setCurrentItems] = useState(all);
  const [currentLoading, setCurrentLoading] = useState(allLoading);

  useEffect(() => {
    let items = all;
    let loading = allLoading;

    switch (activeTab) {
      case 0:
        items = inProgress;
        loading = isStatusLoading;
        break;

      case 1:
        items = completed;
        loading = isStatusLoading;
        break;

      case 2:
        items = failed;
        loading = isStatusLoading;
        break;

      default:
        items = all;
        loading = allLoading;
        break;
    }

    setCurrentItems(items);
    setCurrentLoading(loading);
  }, [
    all,
    inProgress,
    completed,
    failed,
    activeTab,
    allLoading,
    isStatusLoading,
    setCurrentItems,
    setCurrentLoading,
  ]);

  return {
    currentItems,
    currentLoading,
  };
};
