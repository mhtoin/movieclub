import { PusherContext } from "@/utils/PusherProvider";
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
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useSession } from "next-auth/react";

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
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
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

export const useGetWatchProvidersQuery = () => {
  return useQuery({
    queryKey: ["watchProviders"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region-FI`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      console.log("data in query", data);
      /**
       * We should provide some reasonable defaults here and store them somewhere
       */
      const providers = data.results.filter((provider: any) => {
        return (
          provider.provider_name === "Netflix" ||
          provider.provider_name === "Disney Plus" ||
          provider.provider_name === "Amazon Prime Video" ||
          provider.provider_name === "HBO Max" ||
          provider.provider_name === "SkyShowtime" ||
          provider.provider_name === "Yle Areena"
        );
      });
      return providers;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetTMDBSession = (
  userId: string,
  setSessionId: (value: any) => void,
  setAccountId: (value: any) => void
) => {
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
  const { data: session } = useSession();
  console.log("id in session", session);
  useEffect(() => {
    const loc = window.location.search;

    if (loc && session?.user?.userId) {
      let locParts = loc ? loc.split("&") : "";

      if (locParts && locParts.length > 1) {
        let token = locParts[0].split("=")[1];

        let approved = locParts[1] === "approved=true";

        if (approved) {
          let authenticationCallback = `https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.NEXT_PUBLIC_MOVIEDB_KEY}&request_token=${token}`;

          let getSessionId = async () => {
            let res = await fetch(authenticationCallback);

            if (res.ok) {
              let id = await res.json();
              setSessionId(id.session_id);

              // finally, fetch the account id
              let accountRes = await fetch(
                `https://api.themoviedb.org/3/account?api_key=${process.env.NEXT_PUBLIC_MOVIEDB_KEY}&session_id=${id.session_id}`
              );

              let accountBody = await accountRes.json();

              setAccountId(accountBody.id);

              if (id.session_id && accountBody.id) {
                console.log("fetching", userId);
                await fetch(`/api/user/${session?.user?.userId}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    sessionId: id.session_id,
                    accountId: accountBody.id,
                  }),
                });
              }
              setNotification(
                "You need to log out and log back in for the changes to take effect",
                "success"
              );
            }
          };

          getSessionId();
        }
      }
    }
  }, [session]);
};
