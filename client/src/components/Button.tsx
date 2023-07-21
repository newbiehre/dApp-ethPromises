type StyledButtonProps = {
  title: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const CreateButton = ({
  title,
  className,
  type = "button",
  onClick,
}: StyledButtonProps) => {
  return (
    <button
      className={`bg-gradient-to-r from-pink-500 to-yellow-500 font-bold p-3 rounded-2xl w-36 ${className}`}
      type={type}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export const VerifyButton = ({
  title,
  className,
  type = "button",
  onClick,
}: StyledButtonProps) => {
  return (
    <button
      className={`bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% hover:from-pink-500 hover:to-yellow-500 ${className}`}
      type={type}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export const BorderedButton = ({
  title,
  type = "button",
  onClick,
}: StyledButtonProps) => {
  return (
    <button
      className="p-2 w-full rounded-xl border-2 border-white font-bold"
      type={type}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
