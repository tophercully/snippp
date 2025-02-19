"use client";
import { CheckCircle, Info, XCircle } from "lucide-react";
import React, {
  createContext,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { signal } from "@preact-signals/safe-react";

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

const notifMessage = signal<string | null>(null);
const notifType = signal<NotifType>("info");
const notifTimeout = signal<number | undefined>(undefined);
const notifShowCountdown = signal<boolean>(true);

export const NotifProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const showNotif = (
    message: string,
    type: NotifType,
    timeout?: number,
    showCountdown: boolean = true,
  ) => {
    notifMessage.value = message;
    notifType.value = type;
    notifTimeout.value = timeout;
    notifShowCountdown.value = showCountdown;
  };

  const hideNotif = () => {
    notifMessage.value = null;
    notifType.value = "info";
    notifTimeout.value = undefined;
    notifShowCountdown.value = true;
  };

  return (
    <NotifContext.Provider value={{ showNotif, hideNotif }}>
      {children}
      {notifMessage.value &&
        ReactDOM.createPortal(
          <Notif
            message={notifMessage.value}
            type={notifType.value}
            onClose={hideNotif}
            timeout={notifTimeout.value}
            showCountdown={notifShowCountdown.value}
          />,
          document.body,
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
    // Set visible after a brief delay to ensure mount animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    if (timeout) {
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timeout - elapsed);

        if (remaining > 0) {
          setProgress((remaining / timeout) * 100);
          timerRef.current = setTimeout(tick, 16); // ~60 fps
        } else {
          setProgress(0);
          handleClose();
        }
      };

      if (showCountdown) {
        timerRef.current = setTimeout(tick, 16);
      } else {
        timerRef.current = setTimeout(handleClose, timeout);
      }
    }

    return () => {
      clearTimeout(showTimer);
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

  const notifIconClass = `${iconColor} flex aspect-square h-6 items-center justify-center rounded-full p-1`;

  return (
    <div
      className={`fixed bottom-4 right-4 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${borderColor} relative flex max-w-[80vw] flex-col rounded-xl border bg-base-50 p-4 text-black shadow-lg dark:bg-base-950 dark:text-white`}
      >
        <div className="flex items-center">
          {type === "success" && (
            <CheckCircle
              color="white"
              className={notifIconClass}
            />
          )}
          {type === "error" && (
            <XCircle
              color="white"
              className={notifIconClass}
            />
          )}
          {type === "info" && (
            <Info
              color="white"
              className={notifIconClass}
            />
          )}
          <p className="mx-4">{message}</p>
          <button
            onClick={handleClose}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-xl bg-white text-gray-800 focus:outline-none"
          >
            <span>✕</span>
          </button>
        </div>
        {timeout && showCountdown && (
          <div className="mt-2 h-1 w-full bg-white bg-opacity-30">
            <div
              className={`h-full ${iconColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const useNotif = (): NotifContextType => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif must be used within a NotifProvider");
  }
  return context;
};

export default NotifProvider;
