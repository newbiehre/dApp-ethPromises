import { BeatLoader } from "react-spinners";

type DashboardProps = {
  header: string;
  description: string;
  description2?: string;
  creationSize: number;
  completedSize: number;
  failedSize: number;
  children?: React.ReactNode;
  isLoading: boolean;
};

export const Dashboard = ({
  header,
  description,
  description2,
  creationSize,
  completedSize,
  failedSize,
  children,
  isLoading,
}: DashboardProps) => {
  return (
    <div className="p-5 text-white rounded-xl border-2 border-gray-700">
      <div className="pt-10 md:pt-20 pb-0 flex flex-col justify-items-center gap-y-10">
        <h1 className="text-2xl md:text-3xl">{header}</h1>
        <div className="flex flex-col gap-y-5 text-sm md:text-lg">
          <p className="text-red-300">{description}</p>
          <p className="text-red-300">{description2}</p>
        </div>
        {children && <div>{children}</div>}
      </div>
      <div className="flex sm:flex-row flex-col justify-around items-center py-10 text-sm md:text-lg">
        <Stat isLoading={isLoading} title="in progress" size={creationSize} />
        <Stat isLoading={isLoading} title="completed" size={completedSize} />
        <Stat isLoading={isLoading} title="failed" size={failedSize} />
      </div>
    </div>
  );
};

type StatProps = {
  isLoading: boolean;
  size: number;
  title: string;
};

export const Stat = ({ title, size, isLoading }: StatProps) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-32 ">
      {isLoading ? (
        <BeatLoader
          className="h-6"
          color="#36d7b7"
          loading={isLoading}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <h1 className="h-6 text-green-300">{size}</h1>
      )}
      <h2>{title}</h2>
    </div>
  );
};
