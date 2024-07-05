import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export type NotifType = "success" | "error" | "info";

export interface NotifContextType {
  showNotif: (message: string, type: NotifType, timeout?: number) => void;
  hideNotif: () => void;
}

export const NotifContext = createContext<NotifContextType | undefined>(
  undefined,
);

export const NotifProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [notifMessage, setNotifMessage] = useState<string | null>(null);
  const [notifType, setNotifType] = useState<NotifType>("info");
  const [notifTimeout, setNotifTimeout] = useState<number | undefined>(
    undefined,
  );

  const showNotif = useCallback(
    (message: string, type: NotifType, timeout?: number) => {
      setNotifMessage(message);
      setNotifType(type);
      setNotifTimeout(timeout);
    },
    [],
  );

  const hideNotif = useCallback(() => {
    setNotifMessage(null);
    setNotifType("info");
    setNotifTimeout(undefined);
  }, []);

  return (
    <NotifContext.Provider value={{ showNotif, hideNotif }}>
      {children}
      {notifMessage && (
        <Notif
          message={notifMessage}
          type={notifType}
          onClose={hideNotif}
          timeout={notifTimeout}
        />
      )}
    </NotifContext.Provider>
  );
};

interface NotifProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  timeout?: number;
}

const Notif: React.FC<NotifProps> = ({ message, type, onClose, timeout }) => {
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
    : "bg-blue-900";

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
