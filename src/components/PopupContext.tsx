import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export type PopupType = "success" | "error" | "info";

export interface PopupContextType {
  showPopup: (message: string, type: PopupType, timeout?: number) => void;
  hidePopup: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined,
);

export const PopupProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<PopupType>("info");
  const [popupTimeout, setPopupTimeout] = useState<number | undefined>(
    undefined,
  );

  const showPopup = useCallback(
    (message: string, type: PopupType, timeout?: number) => {
      setPopupMessage(message);
      setPopupType(type);
      setPopupTimeout(timeout);
    },
    [],
  );

  const hidePopup = useCallback(() => {
    setPopupMessage(null);
    setPopupType("info");
    setPopupTimeout(undefined);
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popupMessage && (
        <Popup
          message={popupMessage}
          type={popupType}
          onClose={hidePopup}
          timeout={popupTimeout}
        />
      )}
    </PopupContext.Provider>
  );
};

interface PopupProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  timeout?: number;
}

const Popup: React.FC<PopupProps> = ({ message, type, onClose, timeout }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Matching the transition duration
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);

    if (timeout) {
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timeout - elapsed);
        setProgress((remaining / timeout) * 100);

        if (remaining > 0) {
          timerRef.current = setTimeout(tick, 16); // ~60 fps
        } else {
          setProgress(0);
          setTimeout(handleClose, 100); // Slight delay to ensure the bar reaches 0
        }
      };

      timerRef.current = setTimeout(tick, 16);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, handleClose]);

  const backgroundColor =
    type === "success" ? "bg-green-600"
    : type === "error" ? "bg-red-500"
    : "bg-blue-500";

  return (
    <div
      className={`fixed bottom-4 right-4 transition-all duration-300 ease-in-out ${
        isVisible ?
          "translate-x-0 transform opacity-100"
        : "translate-x-full transform opacity-0"
      }`}
    >
      <div
        className={`${backgroundColor} relative flex flex-col rounded-sm p-4 text-white shadow-lg`}
      >
        <div className="flex items-center">
          <p className="mr-4">{message}</p>
          <button
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded-sm bg-white text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>
        {timeout && (
          <div className="mt-2 h-1 w-full bg-white bg-opacity-30">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%`, float: "right" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
