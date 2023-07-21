import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PromiseEvent } from "../utils/contracts/contract-type";
import { convertToStatus, getContract, mapPromiseEvents } from "../utils/utils";

export const useFetch = (
  to: string | null,
  from: string | null,
  statusIndex: number | null,
  listenToEvents: boolean = false
) => {
  const walletAddress = to || from;
  const [data, setData] = useState<PromiseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const contract = getContract();
        const filter = contract.filters.PromiseUpdate(to, from, statusIndex);
        const events = await contract.queryFilter(filter);
        const promises = mapPromiseEvents(filter, events);
        setData(promises);

        if (listenToEvents) {
          const onNewPromises = (
            to: string,
            from: string,
            status: number,
            promiseId: number,
            amount: number,
            message: string,
            expireAt: number
          ) => {
            const formattedEther = ethers.formatEther(amount);
            const isStranger = walletAddress === null;
            const isForYou =
              !isStranger &&
              walletAddress.toLocaleLowerCase() === to.toLocaleLowerCase();

            let who = isStranger ? "somone" : isForYou ? "your friend" : "you";
            let keyword = "created";
            let detail = "betted eth!";
            switch (status) {
              case 1:
                keyword = "completed";
                detail = `gained ${formattedEther} eth to their friend!`;
                break;

              case 2:
                keyword = "failed to deliver";
                detail = `lost ${formattedEther} eth to their friend!`;
                break;

              default:
                keyword = "created";
                detail = "betted!";
                break;
            }

            toast.isActive(`${who} just ${keyword} a promise & ${detail}!`);
            setData((prevData) => [
              ...prevData,
              {
                id: promiseId,
                amount: formattedEther,
                message,
                status: convertToStatus(status),
              },
            ]);
          };

          const listenToEvents = async () => {
            console.log("listening to events");
            contract.on("PromiseUpdate", onNewPromises);
          };

          setIsLoading(false); // don't care to wait for events
          listenToEvents();
          return () => {
            if (contract) {
              contract.off("PromiseUpdate", onNewPromises);
            }
          };
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetch();
  }, [to, from, statusIndex, walletAddress, listenToEvents]);

  return {
    data,
    isLoading,
    walletAddress,
  };
};
