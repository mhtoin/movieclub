import {
  useInfiniteQuery,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { useNotificationStore } from "@/stores/useNotificationStore";
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
import { sendShortlistUpdate } from "./utils";

export const useValidateSession = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");
      const data: DatabaseUser = await response.json();
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
    mutationFn: async ({
      movies,
      startingUserId,
    }: {
      movies: MovieWithUser[];
      startingUserId: string;
    }) => {
      const res = await fetch("/api/weeklyRaffle", {
        method: "POST",
        body: JSON.stringify({ userId: session?.id, movies, startingUserId }),
      });
      const data: { movie: MovieWithUser; chosenIndex: number } =
        await res.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["raffle"], data);
      queryClient.prefetchQuery({
        queryKey: ["movie", data.movie.tmdbId],
        queryFn: () => getMovie(data.movie.tmdbId),
      });
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
      if (!isOpen) {
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

export const useGetWatchlistQuery = (user: DatabaseUser | null) => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (user) {
        return getWatchlist(user);
      }
    },
    enabled: !!user && !!user.sessionId && !!user.accountId,
    staleTime: Infinity,
    gcTime: Infinity,
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

export function useMagneticHover() {
  const navRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    console.log("nav", nav);

    const supportsAnchorPos = "anchorName" in document.documentElement.style;

    // Create or get style sheet
    if (!sheetRef.current) {
      sheetRef.current = document.createElement("style");
      nav.appendChild(sheetRef.current);
    }
    const sheet = sheetRef.current;

    const anchors = Array.from(nav.querySelectorAll("a")) as HTMLElement[];

    const sync = () => {
      const styles = anchors
        .map((anchor, i) => {
          const bounds = anchor.getBoundingClientRect();
          return `
          [data-no-anchor] ul:has(li:nth-of-type(${
            i + 1
          }) a:is(:hover, :focus-visible)) {
            --item-active-y: ${bounds.top}px;
            --item-active-x: ${bounds.left}px;
            --item-active-width: ${bounds.width}px;
            --item-active-height: ${bounds.height}px;
          }
          [data-no-anchor] ul:has(li:nth-of-type(${i + 1}) a:target) {
            --target-y: ${bounds.top}px;
            --target-x: ${bounds.left}px;
            --target-width: ${bounds.width}px;
            --target-height: ${bounds.height}px;
          }
        `;
        })
        .join("\n");

      sheet.textContent = styles; // Use textContent instead of innerHTML
    };

    const falloff = (index: number) => () => {
      if (supportsAnchorPos) {
        nav.style.setProperty("--item-active", `--item-${index + 1}`);
      } else {
        console.log("falloff", index);
        nav.style.setProperty("--item-active-x", `var(--item-${index + 1}-x)`);

        nav.style.setProperty("--item-active-y", `var(--item-${index + 1}-y)`);
        nav.style.setProperty(
          "--item-active-width",
          `var(--item-${index + 1}-width)`
        );
        nav.style.setProperty(
          "--item-active-height",
          `var(--item-${index + 1}-height)`
        );
        console.log("nav", nav.style);
      }
    };

    const deactivate = async () => {
      const transitions = document.getAnimations();
      if (transitions.length) {
        const fade = transitions.find((t) => {
          const effect = t?.effect as unknown as { target: Element };
          return (
            effect?.target === nav.firstElementChild &&
            (effect as KeyframeEffect)?.getKeyframes()[0].property === "opacity"
          );
        });
        if (fade) {
          await Promise.allSettled([fade.finished]);
          if (supportsAnchorPos) {
            nav.style.removeProperty("--item-active");
          } else {
            nav.style.removeProperty("--item-active-x");
            nav.style.removeProperty("--item-active-y");
            nav.style.removeProperty("--item-active-width");
            nav.style.removeProperty("--item-active-height");
          }
        }
      }
    };

    // Initial setup
    if (!supportsAnchorPos) {
      document.documentElement.dataset.noAnchor = "true";
      sync();
      window.addEventListener("resize", sync);
    }

    // Add event listeners
    anchors.forEach((anchor, i) => {
      anchor.addEventListener("pointerenter", falloff(i));
    });
    nav.addEventListener("pointerleave", deactivate);
    nav.addEventListener("blur", deactivate);

    // Cleanup
    return () => {
      if (!supportsAnchorPos) {
        window.removeEventListener("resize", sync);
      }
      anchors.forEach((anchor, i) => {
        anchor.removeEventListener("pointerenter", falloff(i));
      });
      nav.removeEventListener("pointerleave", deactivate);
      nav.removeEventListener("blur", deactivate);
      sheet.remove();
    };
  }, []); // Empty dependency array since we only want this to run once

  return navRef;
}
