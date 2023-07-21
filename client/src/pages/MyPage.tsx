import { useMemo, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CreateButton } from "../components/Button";
import { Dashboard } from "../components/Dashboard";
import { Gallery } from "../components/GridDisplay";
import { Tabs } from "../components/Tabs";
import { useAppSelector } from "../hooks/hooks";
import { useFetch } from "../hooks/useFetch";
import { useFetchByStatus } from "../hooks/useFetchByStatus";
import { useCurrentItems } from "../hooks/useCurrentItems";
import { CreatePopup } from "../popups/CreatePopup";
import { DetailPopup } from "../popups/DetailPopup";

export const MyPage = (): JSX.Element => {
  const walletAddress = useAppSelector((state) => state.walletAddress.value);

  const { data: all, isLoading: allLoading } = useFetch(
    null,
    walletAddress,
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
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      {showCreateForm && (
        <CreatePopup onCloseModal={() => setShowCreateForm(false)} />
      )}
      {showDetailInfo && (
        <DetailPopup
          id={showDetailInfo}
          isVerifiable={false}
          onCloseModal={() => setShowDetailInfo(null)}
        />
      )}

      <div className="flex flex-col h-full justify-center justify-between">
        <Dashboard
          header="my promise to others"
          description="be sure to follow through on your promise (& get your friend to verify on time) so you don't lose out your bet!"
          description2="action to take: create a new promise!"
          creationSize={inProgressSize}
          completedSize={completedSize}
          failedSize={failedSize}
          isLoading={(allLoading === isStatusLoading) === false}
        >
          <CreateButton
            title="create a promise"
            onClick={() => setShowCreateForm(true)}
          />
        </Dashboard>
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
