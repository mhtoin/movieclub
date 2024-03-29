import { PusherContext } from "@/utils/PusherProvider";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { produce } from "immer";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { getSession, useSession } from "next-auth/react";
import { useFilterStore } from "@/stores/useFilterStore";
import {
  getAllShortlistsGroupedById,
  getWatchProviders,
  getWatchlist,
  groupBy,
  searchMovies,
} from "./utils";
import { toast } from "sonner";
import { useRaffleStore } from "@/stores/useRaffleStore";

export const useShortlistsQuery = () => {
  const { data: session } = useSession();
  //console.log('session user is', session)
  return useQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
};

export const useShortlistQuery = (id: string) => {
  return useQuery({
    queryKey: ["shortlist", id],
    queryFn: async () => {
      const response = await fetch(`/api/shortlist/${id}`, {
        cache: "no-store",
      });
      return await response.json();
    },
    enabled: !!id,
  });
};

export const useSearchInfiniteQuery = () => {
  const searchValue = useFilterStore.use.searchValue();
  //console.log('search value is', searchValue)
  return useInfiniteQuery({
    queryKey: ["search", searchValue],
    queryFn: async ({ pageParam }) => searchMovies(pageParam, searchValue),
    getNextPageParam: (lastPage) => {
      const { page, total_pages: totalPages } = lastPage;

      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useRaffleMutation = () => {
  const { data: session } = useSession();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const setResult = useRaffleStore.use.setResult();
  const isOpen = useRaffleStore.use.isOpen();
  return useMutation({
    mutationKey: ["raffle"],
    mutationFn: async () => {
      const res = await fetch("/api/raffle", {
        method: "POST",
        body: JSON.stringify({ userId: session?.user?.userId }),
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
      isReady,
    }: {
      shortlistId: string;
      isReady: boolean;
    }) => {
      const response = await fetch(`/api/shortlist/${shortlistId}/ready`, {
        method: "PUT",
        body: JSON.stringify({ isReady }),
      });

      return await response.json();
    },
    onSuccess: (data, variables) => {
      /*
      queryClient.invalidateQueries({
        queryKey: ["shortlists"],
      });*/
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].isReady = data.isReady;
        });
      });
    },
  });
};

export const useUpdateSelectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shortlistId,
      selectedIndex,
    }: {
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
      /*
      queryClient.invalidateQueries({
        queryKey: ["shortlist"],
      });*/
    },
  });
};

export const useAddToWatchlistMutation = () => {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: async ({ movieId }: { movieId: number }) => {
      const requestBody = JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        watchlist: true,
      });

      const response = await fetch(
        `https://api.themoviedb.org/3/account/${session?.user?.accountId}/watchlist?session_id=${session?.user?.sessionId}`,
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

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
        return produce(oldData, (draft) => {
          draft[variables.shortlistId].movies = data.movies;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
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

export const useGetWatchlistQuery = (user: User) => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => getWatchlist(user),
    enabled: !!user && !!user.sessionId && !!user.accountId,
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
  const { data: session } = useSession();
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
