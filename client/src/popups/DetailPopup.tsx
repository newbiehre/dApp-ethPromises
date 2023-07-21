import { useState } from "react";
import { VerifyForm } from "../forms/VerifyForm";
import { useFetchDetail } from "../hooks/useFetchDetail";
import { getSignedContract, tryConnectToEthereum } from "../utils/utils";
import { Popup } from "./Popup";
import { toast } from "react-toastify";

type DetailPopupProps = {
  id: number;
  isVerifiable: boolean;
  onCloseModal: () => void;
};

export const DetailPopup = ({
  id: promiseId,
  isVerifiable,
  onCloseModal,
}: DetailPopupProps) => {
  const { promiseDetail, isLoading: isLoadingDetail } =
    useFetchDetail(promiseId);
  const [isLoading, setIsLoading] = useState(isLoadingDetail);

  const handleVerify = async (msg: string) => {
    if (!isLoading) {
      setIsLoading(true);
      onCloseModal();
      toast("submitting your verification ...");

      await tryConnectToEthereum(async (ethereum) => {
        const signedContract = await getSignedContract(ethereum);
        await signedContract
          .verifyPromiseCompletion(promiseId)
          .then((tx) => {
            console.log(`promise verified`);
            console.log(tx);
            toast.success(msg);
          })
          .catch((e) => {
            console.error(e);
            toast.error("could not verify - pls try again later!");
          });
      });
      setIsLoading(false);
    }
  };

  return (
    <Popup isLoading={isLoading} isDefault onCloseModal={onCloseModal}>
      {promiseDetail &&
        (isVerifiable ? (
          <VerifyForm promise={promiseDetail} onSubmit={handleVerify} />
        ) : (
          <VerifyForm promise={promiseDetail} />
        ))}
    </Popup>
  );
};
