import { queryOptions } from "@tanstack/react-query";

export const tierlistKeys = {
  all: () => ["tierlists"] as const,
  byId: (id: string) =>
    queryOptions({
      queryKey: ["tierlists", id],
      queryFn: async (): Promise<Tierlist> => {
        const res = await fetch(`/api/tierlists/${id}`);
        return res.json();
      },
    }),
};
