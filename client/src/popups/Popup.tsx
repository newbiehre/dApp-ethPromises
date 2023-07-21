import { ImCross } from "react-icons/im";
import Modal from "react-modal";
import { HashLoader } from "react-spinners";

type PopupProps = {
  onCloseModal: () => void;
  isLoading: boolean;
  isDefault: boolean;
  children?: React.ReactNode;
};

export const Popup = ({
  onCloseModal,
  isDefault,
  isLoading,
  children,
}: PopupProps) => {
  const customStyles: Modal.Styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      background: isDefault
        ? "linear-gradient(to right, #6366f1 10%, #7dd3fc 30%, #10b981 90%)"
        : "linear-gradient(to right, #ec4899, #fbbf24)",
      color: "#fff",
      transform: "translate(-50%, -50%)",
      border: "none",
      borderRadius: "0.75rem",
      maxWidth: "100vh",
      maxHeight: "100vh",
    },
  };

  return (
    <Modal
      appElement={document.getElementById("root") as HTMLElement}
      isOpen={true}
      onRequestClose={onCloseModal}
      contentLabel="Popup Modal"
      style={customStyles}
    >
      <div className="max-w-screen">
        <ImCross className="mb-5" onClick={onCloseModal} />
        {isLoading ? (
          <HashLoader
            color="#36d7b7"
            loading={isLoading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div className="p-5 md:p-10 rounded-xl bg-gray-900 max-w-3xl flex flex-col gap-y-10">
            {children}
          </div>
        )}
      </div>
    </Modal>
  );
};
