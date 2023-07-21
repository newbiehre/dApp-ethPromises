import { EventLog, ethers } from "ethers";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  PromiseEvent,
  PromiseStatus,
} from "./contracts/contract-type";
import { toast } from "react-toastify";

export const tryConnectToEthereum = async (task: (ethereum: any) => void) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      task(ethereum);
    } else {
      console.log("Metamask is not connected");
    }
  } catch (error) {
    console.error(error);

    if (ethers.isError(error, "CALL_EXCEPTION")) {
      toast.error(`Error: ${error.revert?.args[0]}`);
    } else {
      toast.error(`Error: issue with metamask`);
    }
  }
  return true;
};

export const getSignedContract = async (ethereum: any) => {
  const provider = new ethers.BrowserProvider(ethereum, "any");
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getContract = () => {
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/XckIg7ngzev_BGOP5DlCVEj8ECcqi7HX"
  );
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

export const mapPromiseEvents = (
  topic: ethers.DeferredTopicFilter,
  logs: (ethers.Log | EventLog)[]
): PromiseEvent[] => {
  const contractInterface = new ethers.Interface(CONTRACT_ABI);
  return logs
    .map((log) => new EventLog(log, contractInterface, topic.fragment))
    .map((event) => event.args)
    .map((result: any) => result.map((value: any) => value.toString()))
    .map((element: any) => {
      return {
        id: element[3],
        amount: ethers.formatEther(element[4]),
        message: element[5],
        status: convertToStatus(Number(element[2])),
      };
    });
};

export const convertStringToDateObject = (dateString: string) => {
  const [dd, mm, yyyy] = dateString
    .split("/")
    .map((part) => parseInt(part, 10));
  return new Date(yyyy, mm - 1, dd);
};

export const convertNumberToDate = (date: string) => {
  const timestamp = parseInt(date, 10);
  return new Date(timestamp * 1000);
};

export const convertToStatus = (statusIndex: number) => {
  return Object.values(PromiseStatus)[statusIndex];
};
