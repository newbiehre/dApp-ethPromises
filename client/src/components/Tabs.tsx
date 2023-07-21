import { PromiseStatus } from "../utils/contracts/contract-type";

type TabsProps = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <ul className="text-md sm:text-xl text-white items-center grid sm:grid-cols-4 gap-x-5 py-5 mx-2">
      <Tab
        title="all"
        isActive={activeTab === 3}
        onClick={() => setActiveTab(3)}
      />
      <Tab
        title={PromiseStatus.IN_PROGRESS.toLocaleLowerCase()}
        isActive={activeTab === 0}
        onClick={() => setActiveTab(0)}
      />
      <Tab
        title={PromiseStatus.COMPLETED.toLocaleLowerCase()}
        isActive={activeTab === 1}
        onClick={() => setActiveTab(1)}
      />
      <Tab
        title={PromiseStatus.FAILED.toLocaleLowerCase()}
        isActive={activeTab === 2}
        onClick={() => setActiveTab(2)}
      />
    </ul>
  );
};

type TabProps = {
  title: string;
  isActive: boolean;
  onClick: () => void;
};

const Tab = ({ title, isActive, onClick }: TabProps) => (
  <li
    className="hover:text-pink-500 text-purple-500 font-bold cursor-pointer"
    onClick={onClick}
  >
    <p
      className={`p-3 ${
        isActive && "text-pink-500 border-b-2 border-b-pink-500"
      }`}
    >
      {title}
    </p>
  </li>
);
