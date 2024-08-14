import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export type NotifType = "success" | "error" | "info";

export interface NotifContextType {
  showNotif: (
    message: string,
    type: NotifType,
    timeout?: number,
    showCountdown?: boolean,
  ) => void;
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
  const [notifShowCountdown, setNotifShowCountdown] = useState<boolean>(true);

  const showNotif = useCallback(
    (
      message: string,
      type: NotifType,
      timeout?: number,
      showCountdown: boolean = true,
    ) => {
      setNotifMessage(message);
      setNotifType(type);
      setNotifTimeout(timeout);
      setNotifShowCountdown(showCountdown);
    },
    [],
  );

  const hideNotif = useCallback(() => {
    setNotifMessage(null);
    setNotifType("info");
    setNotifTimeout(undefined);
    setNotifShowCountdown(true);
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
          showCountdown={notifShowCountdown}
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
  showCountdown?: boolean;
}

const Notif: React.FC<NotifProps> = ({
  message,
  type,
  onClose,
  timeout,
  showCountdown = true,
}) => {
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

      if (showCountdown) {
        timerRef.current = setTimeout(tick, 16);
      } else {
        timerRef.current = setTimeout(tick, 16);
        // timerRef.current = setTimeout(
        //   () => setTimeout(handleClose, timeout),
        //   timeout,
        // );
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, handleClose, showCountdown]);

  const borderColor =
    type === "success" ? "border-green-600"
    : type === "error" ? "border-red-500"
    : "border-blue-600";

  const iconColor =
    type === "success" ? "bg-green-600"
    : type === "error" ? "bg-red-500"
    : "bg-blue-600";

  const notifIcon =
    type === "success" ? "/check.svg"
    : type === "error" ? "/exclamation.svg"
    : "/info.svg";
  return (
    <div
      className={`fixed bottom-4 right-4 transition-all duration-200 ease-in-out ${
        isVisible ?
          "translate-x-0 transform opacity-100"
        : "translate-x-full transform opacity-0"
      }`}
    >
      <div
        className={`${borderColor} relative flex max-w-[80vw] flex-col rounded-sm border bg-base-50 p-4 text-black shadow-lg dark:bg-base-950 dark:text-white`}
      >
        <div className="flex items-center">
          <img
            src={notifIcon}
            className={`${iconColor} flex aspect-square h-6 items-center justify-center rounded-full p-1`}
          />
          <p className="mx-4">{message}</p>
          <button
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded-sm bg-white text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>
        {timeout && showCountdown && (
          <div className="mt-2 h-1 w-full bg-white bg-opacity-30">
            <div
              className={`h-full ${iconColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%`, float: "right" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
