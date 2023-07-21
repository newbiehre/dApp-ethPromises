import { useState } from "react";
import { BorderedButton, CreateButton } from "../components/Button";
import { useAppSelector } from "../hooks/hooks";
import { convertStringToDateObject } from "../utils/utils";
import { toast } from "react-toastify";

type CreateFormProps = {
  onSubmit: (
    friendsWallet: string,
    promiseMessage: string,
    betAmount: number,
    expirationDate: Date
  ) => void;
};

export const CreateForm = ({ onSubmit }: CreateFormProps) => {
  const walletAddress = useAppSelector((state) => state.walletAddress.value);

  const [forSelf, setForSelf] = useState(false);
  const [wallet, setWallet] = useState("");
  const [promiseMessage, setPromiseMessage] = useState("");
  const [betAmount, setBetAmount] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");

  return (
    <form
      className="flex flex-col md:gap-y-10 text-sm md:text-lg"
      onSubmit={(e) => {
        e.preventDefault();

        let containsError = null;
        if ([wallet, promiseMessage, expirationDate].includes("")) {
          containsError = "fields cannot be left empty";
        }
        if (!containsError && betAmount < 0.01) {
          containsError = "must bet at least 0.01 eth";
        }
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const isDateValid = dateRegex.test(expirationDate);
        if (!containsError && !isDateValid) {
          containsError = "invalid date";
        }

        containsError
          ? toast.error(containsError)
          : onSubmit(
              wallet,
              `i promise ${promiseMessage}`,
              betAmount,
              convertStringToDateObject(expirationDate)
            );
      }}
      onReset={() => {
        setForSelf(false);
        setWallet("");
        setPromiseMessage("");
        setBetAmount(0);
        setExpirationDate("");
      }}
    >
      <h1 className="text-2xl text-center py-5">Create a promise!</h1>

      <div>
        <div className="flex flex-col gap-2 py-5">
          <label>Please enter your friend's wallet address.</label>
          <div>
            <label>For Self: </label>
            <input
              className="accent-pink-500"
              type="checkbox"
              name="forSelf"
              checked={forSelf}
              onChange={(e) => {
                setForSelf(e.target.checked);
                if (e.target.checked) {
                  setWallet(walletAddress);
                }
              }}
            />
          </div>
          <input
            className="p-1 text-gray-900 rounded-sm focus:outline-pink-500 border-0 caret-pink-500"
            type="text"
            placeholder="e.g. 0x0c3cd4cbe07749444b43a2bb8a8525104eec0efa"
            value={forSelf ? walletAddress : wallet}
            onChange={(e) => {
              setForSelf(false);
              setWallet(e.target.value.trim());
            }}
          />
        </div>

        <div className="flex flex-col gap-2 py-5">
          <label>What is your promise? State an action. </label>
          <div className="flex justify-between items-center w-full max-w-screen-md">
            <p className="p-1 bg-white text-gray-600">i promise</p>
            <input
              className="p-1 flex-grow p-1 text-gray-900 rounded-r-sm focus:outline-pink-500 border-0 caret-pink-500"
              type="text"
              placeholder={`... e.g. to do your laundry`}
              onChange={(e) => setPromiseMessage(e.target.value.trim())}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 py-5">
          <label>
            How much are you willing to bet that you will deliver on your
            promise? (In eth)
          </label>
          <div className="flex place-items-center gap-2 justify-between">
            <input
              className="p-1 w-full text-gray-900 rounded-sm focus:outline-pink-500 border-0 caret-pink-500"
              type="text"
              placeholder={`e.g. 0.5`}
              onChange={(e) => setBetAmount(+e.target.value)}
            />
            <p>Eth</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-5">
          <label>
            When do you plan on delivering your promise by? Write an expiration
            date.
          </label>
          <input
            className="p-1 text-gray-900 rounded-sm focus:outline-pink-500 border-0 caret-pink-500"
            type="text"
            placeholder={"e.g. dd/mm/yyyy"}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
      </div>

      <div className="py-10 flex flex-col gap-2 text-sm">
        <p>Please note:</p>
        <ul className="pl-10 list-disc list-outside flex flex-wrap gap-3">
          <li>
            Upon submission, your promise will be immutable and will forever be
            on the blockchain. This means you cannot back out of your promise,
            not unless you want to lose to your friend!
          </li>
          <li>
            Only your friend (using the same wallet address as stated) can
            verify your promise as completed before or on the deadline. This
            also means that you have to make sure they verify on time, otherwise
            they can simply obtain the money you had bet with!
          </li>
          <li>
            Successful delivery of your promise and have your friend verify by
            the deadline means you get your money back.
          </li>
          <li>
            Failure to deliver your promise or have your friend verify by the
            deadline means you lose your money to your friend (upon their later
            verification attempt). Please settle your quarrel off-chain!
          </li>
        </ul>
      </div>

      <div className="flex justify-between gap-20">
        <BorderedButton title="reset" type="reset" />
        <CreateButton className="w-full" title="create" type="submit" />
      </div>
    </form>
  );
};
