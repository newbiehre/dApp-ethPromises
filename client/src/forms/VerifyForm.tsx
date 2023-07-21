import { differenceInDays } from "date-fns";
import { VerifyButton } from "../components/Button";
import { useAppSelector } from "../hooks/hooks";
import { PromiseDetail } from "../utils/contracts/contract-type";

type VerifyFormProps = {
  promise: PromiseDetail;
  onSubmit?: (msg: string) => void;
};

export const VerifyForm = ({ promise, onSubmit }: VerifyFormProps) => {
  const walletAddress = useAppSelector((state) => state.walletAddress.value);

  const { from, amount, message, expireAt, isSettled } = promise;
  const isYou = walletAddress.toLowerCase() === from.toLowerCase();
  const who = isYou ? "you" : "they";
  const who2 = isYou ? "your" : "their";

  const now = new Date();
  const isExpired = expireAt < now;
  const diffTime = Math.abs(differenceInDays(now, expireAt));

  const verifyMessage = isExpired
    ? `verify ${who2} failure!`
    : `verify ${who2} completion!`;

  return (
    <form className="text-lg text-center">
      {onSubmit && (
        <h1 className="text-2xl text-center py-10">
          did {who} complete {who2} promise?
        </h1>
      )}

      <div className="flex flex-col items-center gap-5 md:gap-10 mb-10">
        <p className="text-green-300 text-md md:text-3xl">{`"${message}"`}</p>

        {onSubmit && !isYou && (
          <Details label="from" text={isYou ? "you" : from} />
        )}
        <Details
          label="expires on"
          text={expireAt.toDateString().toLocaleLowerCase()}
        />
        <Details
          className="text-pink-300"
          text={`today is ${now.toDateString().toLocaleLowerCase()}.`}
          moreText={`this promise is ${
            isExpired ? "behind" : "ahead"
          } by ${diffTime} days.`}
        />

        {onSubmit && (
          <div className="py-5 text-sm md:text-lg">
            {isExpired ? (
              <>
                <p>they didn't deliver their promise...</p>
                <p> but at least you get some $ out of it...</p>
                <p>
                  <span className="text-green-300">{`${amount} eth`}</span> to
                  be exact!
                </p>
              </>
            ) : (
              <p>{`a job well done ${isYou ? "" : "to your friend"}!`}</p>
            )}
          </div>
        )}
      </div>

      {isSettled ? (
        <div className="w-full p-3 font-bold align-right border-2 border-dotted text-green-300">
          already settled!
        </div>
      ) : (
        <>
          {onSubmit && (
            <VerifyButton
              title={verifyMessage}
              className="w-full p-3 rounded-xl font-bold align-right"
              onClick={(e) => {
                e.preventDefault();
                const loadingMessage = isExpired
                  ? "verified - dw, its ok even if the promise wasn't delivered"
                  : "verified - yay, the promise was delivered";

                onSubmit(loadingMessage);
              }}
            />
          )}
        </>
      )}
    </form>
  );
};

type DetailsProps = {
  className?: string;
  label?: string;
  text: string;
  moreText?: string;
};
const Details = ({ className, label, text, moreText }: DetailsProps) => {
  const P = ({ msg }: { msg: string }) => (
    <p className={`text-xl break-all text-green-300 ${className}`}>{msg}</p>
  );
  return (
    <div>
      {label && <label className="text-sm md:text-xl">{label}</label>}
      <P msg={text} />
      {moreText && <P msg={moreText} />}
    </div>
  );
};
