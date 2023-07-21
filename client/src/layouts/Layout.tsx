import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavBar } from "../components/NavBar";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { initalize } from "../store/walletAddressSlice";
import { tryConnectToEthereum } from "../utils/utils";

export const Layout = () => {
  const walletAddress = useAppSelector((state) => state.walletAddress.value);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isWalletConnected = async () => {
      setIsLoading(true);
      const isTxCompleted = await tryConnectToEthereum(async (ethereum) => {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length <= 0) throw new Error("Metamask not connected.");
        dispatch(initalize(accounts[0]));
      });
      setIsLoading(!isTxCompleted);
    };
    isWalletConnected();
  }, [dispatch]);

  const handleWalletConnection = async () => {
    setIsLoading(true);
    const isTxCompleted = await tryConnectToEthereum(async (ethereum) => {
      if (!ethereum) throw new Error("Please install metamask wallet.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(initalize(accounts[0]));
    });
    setIsLoading(!isTxCompleted);
  };

  return (
    <>
      <nav className="sticky top-0 flex justify-around bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold">
        <NavBar
          className="px-10 w-screen md:w-3/4"
          walletAddress={walletAddress}
          isWalletLoading={isLoading}
          handleWalletConnection={handleWalletConnection}
        />
      </nav>
      <main className="min-h-screen flex justify-center text-center bg-gray-900 gap-y-100">
        <ToastContainer />
        <div className="p-10 w-screen md:w-3/4">
          <Outlet />
        </div>
      </main>

      <footer className="h-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-white text-md text-center p-10">
          for vik, from jodi
        </h1>
      </footer>
    </>
  );
};
