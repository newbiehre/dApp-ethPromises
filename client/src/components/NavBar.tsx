import { useMemo, useState } from "react";
import { CgMenu } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import { NavLink, useLocation } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { BorderedButton } from "./Button";

type NavBarProps = {
  className?: string;
  walletAddress: string;
  isWalletLoading: boolean;
  handleWalletConnection: () => void;
};
export const NavBar = ({
  className,
  walletAddress,
  isWalletLoading,
  handleWalletConnection,
}: NavBarProps) => {
  const location = useLocation();
  const defaultTab = useMemo(() => {
    let tab = 3;
    switch (location.pathname) {
      case "/my-promises": {
        tab = 1;
        break;
      }
      case "/others-promises": {
        tab = 2;
        break;
      }
      default: {
        tab = 0;
        break;
      }
    }
    return tab;
  }, [location]);

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className={` py-2 ${className}`}>
      <div className="flex items-center justify-between gap-x-10">
        {/** Logo */}
        <NavLink
          className="text-center border-2 rounded-xl p-2 text-xl sm:w-fit md:w-fit lg:w-fit
          xl:w-fit"
          to="/"
          onClick={() => setActiveTab(0)}
        >
          <div className="text-sm sm:text-sm md:text-xl lg:text-2xl xl:text-2xl">
            <p>i</p>
            <span className="text-green-300">PROMISE</span>
            <p>la!</p>
          </div>
        </NavLink>

        {/** NavBar when minimized */}
        <div
          className="w-full text-center cursor-pointer md:hidden text-2xl text-green-300"
          onClick={() => setMenuIsOpen(true)}
        >
          {activeTab === 0 ? "all" : activeTab === 1 ? "mine" : "others"}
        </div>

        <div className="md:w-full">
          <CgMenu
            className="md:hidden"
            size={50}
            onClick={() => setMenuIsOpen((prevValue) => !prevValue)}
          />

          {menuIsOpen && (
            <div className="md:hidden absolute w-full p-5 top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold">
              <div className="flex flex-col gap-10 items-center text-2xl">
                <ImCross
                  className="place-self-end"
                  size={20}
                  onClick={() => setMenuIsOpen(false)}
                />

                <div className="flex flex-col gap-5 items-center">
                  <NavLinks
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setMenuIsOpen={setMenuIsOpen}
                  />
                </div>

                <div className="flex gap-5 text-xl">
                  <WalletDetail
                    isWalletLoading={isWalletLoading}
                    walletAddress={walletAddress}
                    handleWalletConnection={handleWalletConnection}
                  />
                </div>
              </div>
            </div>
          )}

          {/** NavBar & Wallet in full screen */}
          <div className="grid grid-cols-3 hidden md:block xl:text-2xl">
            <NavLinks
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setMenuIsOpen={setMenuIsOpen}
            />
          </div>
        </div>

        <div className="text-end hidden md:block xl:text-xl">
          <WalletDetail
            isWalletLoading={isWalletLoading}
            walletAddress={walletAddress}
            handleWalletConnection={handleWalletConnection}
          />
        </div>
      </div>
    </div>
  );
};

type NavLinksProps = {
  activeTab: number;
  setActiveTab: (index: number) => void;
  setMenuIsOpen?: (open: boolean) => void;
};

const NavLinks = ({
  activeTab,
  setActiveTab,
  setMenuIsOpen,
}: NavLinksProps) => {
  return (
    <>
      <NavLink
        className={`p-2 ${
          activeTab === 0 && "text-green-300"
        } hover:text-green-300`}
        to="/"
        onClick={() => {
          setActiveTab(0);
          setMenuIsOpen && setMenuIsOpen(false);
        }}
      >
        all
      </NavLink>
      <NavLink
        className={` p-1 ${
          activeTab === 1 && "text-green-300"
        } hover:text-green-300`}
        to="/my-promises"
        onClick={() => {
          setActiveTab(1);
          setMenuIsOpen && setMenuIsOpen(false);
        }}
      >
        mine
      </NavLink>
      <NavLink
        className={`p-1 ${
          activeTab === 2 && "text-green-300"
        } hover:text-green-300`}
        to="/others-promises"
        onClick={() => {
          setActiveTab(2);
          setMenuIsOpen && setMenuIsOpen(false);
        }}
      >
        others
      </NavLink>
    </>
  );
};

type WalletDetailProps = {
  walletAddress: string | null;
  isWalletLoading: boolean;
  handleWalletConnection: () => void;
};

const WalletDetail = ({
  walletAddress,
  isWalletLoading,
  handleWalletConnection,
}: WalletDetailProps) => {
  const Wallet = () =>
    walletAddress ? (
      <>
        <h1>my wallet:</h1>
        <h2>
          {walletAddress.substring(0, 5) +
            "..." +
            walletAddress.substring(
              walletAddress.length - 6,
              walletAddress.length - 1
            )}
        </h2>
      </>
    ) : (
      <BorderedButton title="connect wallet" onClick={handleWalletConnection} />
    );

  return (
    <div className="text-center w-fit">
      {isWalletLoading ? (
        <BeatLoader
          className="w-20"
          color="#ffffff"
          loading={isWalletLoading}
          size={7}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <Wallet />
      )}
    </div>
  );
};
