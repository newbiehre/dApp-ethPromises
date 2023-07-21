import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { PromiseDetail } from "../utils/contracts/contract-type";
import {
  convertNumberToDate,
  convertToStatus,
  getContract,
} from "../utils/utils";

export const useFetchDetail = (id: number) => {
  const [promiseDetail, setPromiseDetail] = useState<PromiseDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const contract = getContract();
        await contract.getPromiseById(id).then((element) => {
          setPromiseDetail({
            id: element[0].toString(),
            to: element[1].toString(),
            from: element[2].toString(),
            amount: ethers.formatEther(element[3]).toString(),
            message: element[4].toString(),
            expireAt: convertNumberToDate(element[5].toString()),
            status: convertToStatus(Number(element[6])),
            isSettled: Boolean(element[7]),
          });
        });
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetch();
  }, [id]);

  return {
    promiseDetail,
    isLoading,
  };
};
