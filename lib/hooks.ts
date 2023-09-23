import { PusherContext } from "@/app/home/components/PusherProvider";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";
import { useContext, useEffect } from "react";
import { produce } from "immer";

export const useShortlistQuery = () => {
  return useQuery(["shortlist"], async () => {
    const response = await fetch(`/api/shortlist`);
    return await response.json();
  });
};

const handleShortlistMessage = (
  eventName: string,
  data: PusherMessage,
  queryClient: QueryClient
) => {
  let messageData = data.data as Shortlist;
  let messageType = data.message
  queryClient.setQueryData(["shortlist"], (oldData: any) => {
    return produce(oldData, (draft: Array<Shortlist>) => {
      let targetShortlist = draft.find(
        (shortlist) => shortlist.id === data.data.id
      );

      switch (messageType) {
        case "ready":
          if (targetShortlist) {
            targetShortlist.isReady = messageData.isReady;
          }
          break;
        case "movies":
          if (targetShortlist) {
            targetShortlist.movies = messageData.movies;
          }
          break;
      }
    });
  });
};

const handleMessage = (
  eventName: string,
  channelName: string,
  data: PusherMessage,
  queryClient: QueryClient
) => {
  switch (channelName) {
    case "movieclub-shortlist":
      handleShortlistMessage(eventName, data, queryClient);
      break;
  }
};

export const usePusher = (channelName: string, eventName: string) => {
  const pusher = useContext(PusherContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, (data: PusherMessage) => {
      console.log("bound to", eventName, data);
      handleMessage(eventName, channelName, data, queryClient);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);
};
