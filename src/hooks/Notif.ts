import { useContext } from "react";
import {
  NotifContext,
  NotifContextType,
} from "../components/popups/NotifContext";

export const useNotif = (): NotifContextType => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif must be used within a NotifProvider");
  }
  return context;
};
