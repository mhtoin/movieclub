import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { getQueryClient } from "@/lib/getQueryClient";
import { tierlistKeys } from "@/lib/tierlist/tierlistKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function TierCreate({ tierlistId }: { tierlistId: string }) {
  const queryClient = getQueryClient();
  const { data: tierlistData } = useQuery(tierlistKeys.byId(tierlistId));
  const [tierName, setTierName] = useState("");
  const [createFormState, setCreateFormState] = useState<"closed" | "open">(
    "closed"
  );
  const tierlistMutate = useMutation({
    mutationFn: async (tierName: string) => {
      await fetch(`/api/tierlists/${tierlistId}`, {
        method: "POST",
        body: JSON.stringify({ tierName }),
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tierlists", tierlistId] });
      setCreateFormState("closed");
      setTierName("");
    },
  });

  const handleCreateTier = () => {
    if (createFormState === "open") {
      tierlistMutate.mutate(tierName);
    } else {
      setCreateFormState("open");
    }
  };
  return (
    <div
      className={`hidden md:flex border rounded-tl-md w-24 rounded-bl-md p-2 bg-accent/80 items-center justify-center transition-all duration-300 ${
        createFormState === "open" ? "h-[300px]" : "h-24"
      }`}
    >
      <form
        className="flex flex-col gap-2 items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {createFormState === "open" && (
          <>
            <label
              htmlFor="tier-name"
              className="text-sm text-muted-foreground"
            >
              Tier name
            </label>
            <Input
              id="tier-name"
              className="w-full max-w-xs text-center"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
            />
          </>
        )}
        <Button
          variant={createFormState === "open" ? "outline" : "ghost"}
          size={createFormState === "open" ? "sm" : "icon"}
          onClick={handleCreateTier}
          disabled={tierlistMutate.isPending}
          isLoading={tierlistMutate.isPending}
        >
          {createFormState === "open" ? (
            <span className="text-sm">Create</span>
          ) : (
            <Plus />
          )}
        </Button>
      </form>
    </div>
  );
}
