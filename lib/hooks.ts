import { PusherContext } from "@/app/home/components/PusherProvider";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";
import { useContext, useEffect } from "react";
import { produce } from "immer";
import { getWatchlist } from "./tmdb";

export const useShortlistsQuery = () => {
  return useQuery(["shortlist"], async () => {
    const response = await fetch(`/api/shortlist`);
    return await response.json();
  });
};

export const useShortlistQuery = (id: string) => {
  return useQuery({
    queryKey: ["shortlist", id],
    queryFn: async () => {
      const response = await fetch(`/api/shortlist/${id}`);
      return await response.json();
    },
    enabled: !!id,
  });
};

export const useUpdateShortlistMutation = (method: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      movieId,
      shortlistId,
    }: {
      movieId: string;
      shortlistId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}`, {
        method: method,
        body: JSON.stringify({ movieId }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shortlist"],
      });
    },
  });
};

export const useRemoveFromShortlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      movieId,
      shortlistId,
    }: {
      movieId: string;
      shortlistId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}`, {
        method: "PUT",
        body: JSON.stringify({ movieId }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shortlist"],
      });
    },
  });
};

export const useAddToShortlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      movie,
      shortlistId,
    }: {
      movie: Movie;
      shortlistId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}`, {
        method: "POST",
        body: JSON.stringify({ movie }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["shortlist", variables.shortlistId],
        (oldData: any) => {
          return produce(oldData, (draft: Shortlist) => {
            draft.movies.push(variables.movie);
          });
        }
      );
    },
  });
};

const handleShortlistMessage = (
  eventName: string,
  data: PusherMessage,
  queryClient: QueryClient
) => {
  let messageData = data.data as Shortlist;
  let messageType = data.message;
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

export const useGetWatchlistQuery = (user: User) => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      
      let pagesLeft = true;
      let page = 1;
      const movies = [];

      do {
        let watchlist = await fetch(
          `https://api.themoviedb.org/3/account/${user.accountId}/watchlist/movies?language=en-US&page=${page}&session_id=${user.sessionId}&sort_by=created_at.asc`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
            },
            cache: "no-store",
          }
        );

        let data = await watchlist.json();
        let results = data && data.results ? data.results : [];
        movies.push(results);

        let pages = data && data.total_pages ? data.total_pages : "";

        if (pages >= page) {
          page++;
        } else {
          pagesLeft = false;
        }
      } while (pagesLeft);

      return movies.flat();
    },
    enabled: !!user && !!user.sessionId && !!user.accountId,
  });
};
