import Pusher from "pusher-js";
import { ReactNode, createContext } from "react";

export const PusherContext = createContext({} as Pusher);

export const PusherPovider = ({
  pusher,
  children,
}: {
  pusher: Pusher;
  children: ReactNode;
}) => {
  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};
