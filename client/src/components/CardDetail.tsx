import { PromiseDetail } from "../utils/contracts/contract-type";

type CardDetailProps = {
  event: PromiseDetail;
  verifiable: boolean;
  onClick: () => void;
};

export const CardDetail = ({
  event,
  verifiable: isVerifiable,
  onClick,
}: CardDetailProps) => {
  const { to, from, amount, message, expireAt, status, isSettled } = event;
  return (
    <div
      onClick={onClick}
      className="hover:from-pink-500 hover:to-yellow-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative cursor-pointer p-6 flex flex-col justify-evenly text-white rounded-3xl"
    >
      <p>{`"${message}"`}</p>
      <div>
        <p>{`Bet: ${amount} Eth`}</p>
        <p>{`Status: ${status}`}</p>
      </div>
      <div className="grid grid-cols-2">
        <p>{`To: ${to}`}</p>
        <p>{`From: ${from}`}</p>
        <p>{`Expiration Date: ${expireAt}`}</p>
        <p>{`Is settled: ${isSettled}`}</p>
      </div>

      {isVerifiable && (
        <p className="absolute bottom-3 right-5 text-sm font-bold bg-green-900 p-2 rounded-xl">
          Verify
        </p>
      )}
    </div>
  );
};
