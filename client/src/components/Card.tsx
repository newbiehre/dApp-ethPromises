import { PromiseEvent } from "../utils/contracts/contract-type";

type CardProps = {
  event: PromiseEvent;
  onClick: () => void;
};

export const Card = ({ event, onClick }: CardProps) => {
  const { amount, message, status } = event;

  return (
    <div
      onClick={onClick}
      className="w-full h-48 hover:from-pink-500 hover:to-yellow-500 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% cursor-pointer p-6 flex flex-col justify-evenly text-white rounded-3xl"
    >
      <p>{`"${message}"`}</p>
      <div>
        <p>{`Bet: ${amount} Eth`}</p>
        <p>{`Status: ${status}`}</p>
      </div>
    </div>
  );
};
