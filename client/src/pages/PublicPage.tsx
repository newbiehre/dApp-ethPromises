import { useMemo, useState } from "react";
import { Dashboard } from "../components/Dashboard";
import { Gallery } from "../components/GridDisplay";
import { Tabs } from "../components/Tabs";
import { useFetch } from "../hooks/useFetch";
import { useFetchByStatus } from "../hooks/useFetchByStatus";
import { useCurrentItems } from "../hooks/useCurrentItems";
import { DetailPopup } from "../popups/DetailPopup";

export const PublicPage = () => {
  const { data: all, isLoading: allLoading } = useFetch(null, null, null, true);

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
  const [showModal, setShowModal] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(3);

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
      {showModal && (
        <DetailPopup
          id={showModal}
          isVerifiable={false}
          onCloseModal={() => setShowModal(null)}
        />
      )}

      <div className="flex flex-col h-full justify-center justify-between">
        <Dashboard
          header="promises from all over the world"
          description="on the ethereum blockchain!"
          description2="check out all the promises that people have made to their friends"
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
          onClickCard={(id: number) => setShowModal(id)}
        />
      </div>
    </>
  );
};
