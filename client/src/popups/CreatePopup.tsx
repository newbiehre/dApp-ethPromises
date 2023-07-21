import { ethers } from "ethers";
import { useState } from "react";
import { CreateForm } from "../forms/CreateForm";
import { getSignedContract, tryConnectToEthereum } from "../utils/utils";
import { Popup } from "./Popup";
import { toast } from "react-toastify";

type CreatePopupProps = {
  onCloseModal: () => void;
};

export const CreatePopup = ({ onCloseModal }: CreatePopupProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePromiseCreation = async (
    friendsWallet: string,
    promiseMessage: string,
    betAmount: number,
    expirationDate: Date
  ) => {
    if (!isLoading) {
      setIsLoading(true);
      onCloseModal();
      toast("submitting your creation ...");

      await tryConnectToEthereum(async (ethereum) => {
        const signedContract = await getSignedContract(ethereum);
        signedContract
          .createPromise(
            friendsWallet,
            promiseMessage,
            Math.floor(expirationDate.getTime() / 1000),
            { value: ethers.parseEther(`${betAmount}`) }
          )
          .then((tx) => {
            console.log(`promise created`);
            console.log(tx);
            toast.success("your promise has been submitted to the blockchain!");
          })
          .catch((e) => {
            console.error(e);
            toast.error("could not create - pls try again later!");
          });
      });
      setIsLoading(false);
    }
  };

  return (
    <Popup isLoading={isLoading} isDefault={false} onCloseModal={onCloseModal}>
      <CreateForm onSubmit={handlePromiseCreation} />
    </Popup>
  );
};
