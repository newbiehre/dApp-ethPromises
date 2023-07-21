import { useMemo } from "react";
import { HashLoader } from "react-spinners";
import { PromiseEvent } from "../utils/contracts/contract-type";
import { Card } from "./Card";

type GalleryProps = {
  isLoading: boolean;
  promises: PromiseEvent[];
  onClickCard: (id: number) => void;
};

export const Gallery = ({ isLoading, promises, onClickCard }: GalleryProps) => {
  const renteredItems = useMemo(() => {
    return promises.map((promise, index) => (
      <Card
        key={index}
        event={promise}
        onClick={() => onClickCard(promise.id)}
      />
    ));
  }, [promises, onClickCard]);

  return (
    <div
      className={`flex flex-col p-5 md:p-7 border-2 rounded-xl border-gray-700 h-full
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <HashLoader
            color="#36d7b7"
            loading={isLoading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {promises.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max sm:grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-5 md:gap-10">
              {renteredItems}
            </div>
          ) : (
            <p className="text-white text-center">0 result</p>
          )}
        </>
      )}
    </div>
  );
};
