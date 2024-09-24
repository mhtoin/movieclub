import { PusherContext } from "@/utils/PusherProvider";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { getSession } from "next-auth/react";
import { User as DatabaseUser } from "@prisma/client";
import {
  getAllShortlistsGroupedById,
  getShortlist,
  getWatchProviders,
  getWatchlist,
  searchMovies,
} from "./movies/queries";
import { toast } from "sonner";
import { useRaffleStore } from "@/stores/useRaffleStore";
import { useSearchParams } from "next/navigation";
import { useDialogStore } from "@/stores/useDialogStore";
import { getMovie } from "./movies/queries";
import { replaceShortlistItem } from "./actions/replaceShortlistItem";
import { socket } from "./socket";
import { sendShortlistUpdate } from "./utils";

export const useValidateSession = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");
      const data: DatabaseUser = await response.json();
      console.log("data", data);
      return data;
    },
  });
};

export const useShortlistsQuery = () => {
  return useQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
};

export const useSuspenseShortlistsQuery = () => {
  return useSuspenseQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
};

export const useShortlistQuery = (id: string) => {
  return useQuery({
    queryKey: ["shortlist", id],
    queryFn: () => getShortlist(id),
    enabled: !!id,
  });
};

export const useMovieQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => getMovie(id),
    enabled: !!id && enabled,
  });
};

export const useSearchSuspenseInfiniteQuery = () => {
  const searchParams = useSearchParams();
  const titleSearch = searchParams.get("query");
  const searchType = titleSearch ? "search" : "discover";
  const searchParamsString = searchParams.toString();

  /**
   * If there is a title, we need to use a whole different endpoint to search for movies
   * instead of using the discover endpoint, since that does not support title search
   */

  return useSuspenseInfiniteQuery({
    queryKey: [
      "search",
      searchParams ? searchParamsString : "with_watch_providers=8",
    ],
    queryFn: async ({ pageParam }) =>
      searchMovies(pageParam, searchParamsString, searchType),
    getNextPageParam: (lastPage) => {
      const { page, total_pages: totalPages } = lastPage;

      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useSearchInfiniteQuery = () => {
  const searchParams = useSearchParams().toString();

  return useInfiniteQuery({
    queryKey: [
      "search",
      searchParams ? searchParams : "with_watch_providers=8",
    ],
    queryFn: async ({ pageParam }) => searchMovies(pageParam, searchParams),
    getNextPageParam: (lastPage) => {
      const { page, total_pages: totalPages } = lastPage;

      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useRaffle = () => {
  const { data: session } = useValidateSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ movies }: { movies: MovieWithUser[] }) => {
      const res = await fetch("/api/weeklyRaffle", {
        method: "POST",
        body: JSON.stringify({ userId: session?.id, movies }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.setQueryData(["raffle"], data);
    },
  });
};

export const useRaffleMutation = () => {
  const { data: session } = useValidateSession();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const setResult = useRaffleStore.use.setResult();
  const isOpen = useRaffleStore.use.isOpen();
  return useMutation({
    mutationKey: ["raffle"],
    mutationFn: async () => {
      const res = await fetch("/api/raffle", {
        method: "POST",
        body: JSON.stringify({ userId: session?.id }),
      });
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: (data) => {
      setResult(data.movie);
      setIsLoading(false);
      if (!isOpen) {
        setIsOpen(true);
      }
    },
    onError: (error) => {
      setIsOpen(false);
      setIsLoading(false);
      toast.error(error.message);
    },
  });
};

export const useGetLatestMutationState = (key: string[]) => {
  return useMutationState({
    filters: {
      mutationKey: key,
    },
    select: (mutation) => {
      return mutation.state;
    },
  });

  //return mutationState ? mutationState[mutationState.length - 1] : [];
};
export const useUpdateReadyStateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shortlistId,
      userId,
      isReady,
    }: {
      shortlistId: string;
      isReady: boolean;
      userId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}/ready`, {
        method: "PUT",
        body: JSON.stringify({ isReady }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].isReady = data.isReady;
        });
      });
      sendShortlistUpdate(variables.userId);
    },
  });
};

export const useUpdateParticipationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      shortlistId,
      participating,
    }: {
      userId: string;
      shortlistId: string;
      participating: boolean;
    }) => {
      const response = await fetch(
        `/api/shortlist/${shortlistId}/participation`,
        {
          method: "PUT",
          body: JSON.stringify({ participating }),
        }
      );

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].participating = data.participating;
        });
      });
      sendShortlistUpdate(variables.userId);
    },
  });
};

export const useUpdateSelectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      shortlistId,
      selectedIndex,
    }: {
      userId: string;
      shortlistId: string;
      selectedIndex: number;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}/selection`, {
        method: "PUT",
        body: JSON.stringify({ selectedIndex }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].selectedIndex = data.selectedIndex;
        });
      });
      sendShortlistUpdate(variables.userId);
    },
  });
};

export const useAddToWatchlistMutation = () => {
  const { data: session } = useValidateSession();
  return useMutation({
    mutationFn: async ({ movieId }: { movieId: number }) => {
      const requestBody = JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        watchlist: true,
      });

      const response = await fetch(
        `https://api.themoviedb.org/3/account/${session?.accountId}/watchlist?session_id=${session?.sessionId}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
          },
          body: requestBody,
        }
      );

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Movie added to watchlist");
    },
  });
};

/**
 * TODO: Remove
 */
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
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].movies = data.movies;
        });
      });
      /*
      queryClient.invalidateQueries({
        queryKey: ["shortlist"],
      });*/
    },
  });
};

export const useRemoveFromShortlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      movieId,
      shortlistId,
    }: {
      userId: string;
      movieId: string | number;
      shortlistId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}`, {
        method: "PUT",
        body: JSON.stringify({ movieId }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      toast.success("Movie removed from shortlist");
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].movies = data.movies;
        });
      });
      sendShortlistUpdate(variables.userId);
    },
  });
};

export const useAddToShortlistMutation = () => {
  const queryClient = useQueryClient();
  const isOpen = useDialogStore.use.isOpen();
  const setIsOpen = useDialogStore.use.setIsOpen();
  const setMovie = useDialogStore.use.setMovie();
  return useMutation({
    mutationFn: async ({
      userId,
      movie,
      shortlistId,
    }: {
      userId: string;
      movie: Movie;
      shortlistId: string;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}`, {
        method: "POST",
        body: JSON.stringify({ movie }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      toast.success("Movie added to shortlist");
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].movies = data.movies;
        });
      });
      sendShortlistUpdate(variables.userId);
    },
    onError: (error, variables) => {
      console.log("error", error);

      console.log("error isOpen", isOpen);
      if (!isOpen) {
        console.log("setting isOpen to true");
        console.log("variables", variables.movie);
        setIsOpen(true);
        setMovie(variables.movie);
      }
    },
  });
};

export const useReplaceShortlistMutation = () => {
  const queryClient = useQueryClient();
  const setIsOpen = useDialogStore.use.setIsOpen();
  const setMovie = useDialogStore.use.setMovie();
  return useMutation({
    mutationFn: async ({
      replacedMovie,
      replacingWithMovie,
      shortlistId,
    }: {
      replacedMovie: Movie; // always guaranteed to be of type Movie
      replacingWithMovie: Movie;
      shortlistId: string;
    }) => {
      return await replaceShortlistItem(
        replacedMovie,
        replacingWithMovie,
        shortlistId
      );
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].movies = data.movies.map((movie) => ({
            ...movie,
            watchDate: movie.watchDate || undefined,
            imdbId: movie.imdbId || undefined,
          }));
        });
      });
      toast.success("Movie replaced in shortlist");
      setIsOpen(false);
      setMovie(null);
    },
  });
};

const handleShortlistMessage = (
  eventName: string,
  data: PusherMessage,
  queryClient: QueryClient
) => {
  let messageData = data.data.payload as Shortlist;
  let messageType = data.message;

  queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
    return produce(oldData, (draft) => {
      //console.log('draft is', JSON.parse(JSON.stringify(draft)))
      let targetShortlist = draft[messageData.id];

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
        case "selection":
          if (targetShortlist) {
            targetShortlist.selectedIndex = messageData.selectedIndex;
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

export const usePusher = (
  channelName: string,
  eventName: string,
  userId?: string
) => {
  const pusher = useContext(PusherContext);
  const isOpen = useRaffleStore.use.isOpen();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const setResult = useRaffleStore.use.setResult();
  const isLoading = useRaffleStore.use.isLoading();
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const queryClient = useQueryClient();

  useEffect(() => {
    const bindPusher = async () => {
      const session = await getSession();

      const channel = pusher.subscribe(channelName);
      channel.bind(eventName, (data: PusherMessage) => {
        if (channelName === "movieclub-raffle") {
          const messageType = data.message;
          const messageData = data.data as PusherPayload;
          if (messageData.userId !== session?.user?.userId) {
            if (messageType === "result") {
              const payload = messageData.payload as MovieOfTheWeek;

              if (payload) {
                setResult(payload);
                setIsLoading(false);

                if (!isOpen) {
                  setIsOpen(true);
                }
              }
            } else if (messageType === "request") {
              if (!isOpen) {
                //setIsOpen(!isOpen);
              }

              if (!isLoading) {
                //setIsLoading(!isLoading);
              }
            } else if (messageType === "error") {
              let errorData = messageData.payload as string;

              setIsOpen(false);
              setIsLoading(false);

              if (errorData) {
                toast.error(errorData);
              }
            }
          }
        } else {
          handleMessage(eventName, channelName, data, queryClient);
        }
      });

      return () => {
        pusher.unsubscribe(channelName);
      };
    };
    bindPusher();
  }, []);
};

export const useGetWatchlistQuery = (user: DatabaseUser | null) => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (user) {
        return getWatchlist(user);
      }
    },
    enabled: !!user && !!user.sessionId && !!user.accountId,
  });
};

export const useSuspenseGetWatchlistQuery = (user: DatabaseUser) => {
  return useSuspenseQuery({
    queryKey: ["watchlist"],
    queryFn: async () => getWatchlist(user),
  });
};

export const useGetWatchProvidersQuery = () => {
  return useQuery({
    queryKey: ["watchProviders"],
    queryFn: async () => getWatchProviders(),
    staleTime: Infinity,
    gcTime: Infinity,
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
  const { data: session } = useValidateSession();
  useEffect(() => {
    const loc = window.location.search;

    if (loc && session?.id) {
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
                await fetch(`/api/user/${session?.id}`, {
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

export const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
export function useCreateQueryString(searchParams: URLSearchParams) {
  return useCallback(
    (
      name: string,
      value: string[] | string | number[],
      isRange: boolean = false
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isRange) {
        const min = `${name}.gte`;
        const max = `${name}.lte`;
        params.set(min, value[0].toString());
        params.set(max, value[1].toString());
        return params.toString();
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          params.delete(name);
          return params.toString();
        }
        params.set(name, value.join(","));
        return params.toString();
      } else {
        if (value === "") {
          params.delete(name);
          return params.toString();
        }
        params.set(name, value);
        return params.toString();
      }
    },
    [searchParams]
  );
}

export function useSocket() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const { data: user } = useValidateSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function connect() {
      if (!isRegistered && user) {
        // register the client first
        const res = await fetch(
          `${
            process.env.NODE_ENV === "development"
              ? "http://localhost:8080"
              : process.env.NEXT_PUBLIC_RELAY_URL
          }/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
              topic: "shortlist",
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const webSocket = new WebSocket(data.url);
          webSocket.onopen = () => {
            console.log("WebSocket connection established successfully");
          };

          webSocket.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            const message = JSON.parse(event.data);
            console.log("message", message);
            if ("queryKey" in message) {
              queryClient.invalidateQueries({
                queryKey: message.queryKey,
              });
            } else if ("message" in message) {
              toast.success(message.message);
            } else {
              toast.error("Unknown message type");
            }
          };

          webSocket.onclose = () => {
            console.log("WebSocket connection closed");
          };

          setConnection(webSocket);
          setIsRegistered(true);
          console.log("WebSocket connection established");
        }
      }
    }

    connect();
  }, [isRegistered, user, queryClient]);

  return { connection };
}
