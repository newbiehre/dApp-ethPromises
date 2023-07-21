import { useMemo, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from "../components/Dashboard";
import { Gallery } from "../components/GridDisplay";
import { Tabs } from "../components/Tabs";

import { useAppSelector } from "../hooks/hooks";
import { useFetch } from "../hooks/useFetch";
import { useFetchByStatus } from "../hooks/useFetchByStatus";
import { useCurrentItems } from "../hooks/useCurrentItems";
import { DetailPopup } from "../popups/DetailPopup";

export const OthersPage = (): JSX.Element => {
  const walletAddress = useAppSelector((state) => state.walletAddress.value);

  const { data: all, isLoading: allLoading } = useFetch(
    walletAddress,
    null,
    null
  );

  const {
    inProgress,
    completed,
    failed,
    isLoading: isStatusLoading,
  } = useFetchByStatus(all);
  const [inProgressSize, completedSize, failedSize] = useMemo(
    () => [inProgress.length, completed.length, failed.length],
    [inProgress, completed, failed]
  );

  const [activeTab, setActiveTab] = useState(3);
  const [showDetailInfo, setShowDetailInfo] = useState<number | null>(null);
  const { currentItems, currentLoading } = useCurrentItems(
    all,
    inProgress,
    completed,
    failed,
    activeTab,
    allLoading,
    isStatusLoading
  );

  return (
    <>
      {showDetailInfo && (
        <DetailPopup
          id={showDetailInfo}
          isVerifiable
          onCloseModal={() => setShowDetailInfo(null)}
        />
      )}
      <div className="flex flex-col h-full justify-center justify-between">
        <Dashboard
          header="others' promise to me"
          description="a win-win situation: 1. you benefit from their promise + 2. you gain some $$ if they don't!"
          description2="action to take: verify a promise by clicking on any of them!"
          creationSize={inProgressSize}
          completedSize={completedSize}
          failedSize={failedSize}
          isLoading={(allLoading === isStatusLoading) === false}
        />
        <Tabs
          activeTab={activeTab}
          setActiveTab={(index) => setActiveTab(index)}
        />
        <Gallery
          isLoading={currentLoading}
          promises={currentItems}
          onClickCard={(id: number) => setShowDetailInfo(id)}
        />
      </div>
    </>
  );
};
