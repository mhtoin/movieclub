"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createNewTierlist } from "../actions/actions";
import { Button } from "@/app/components/ui/Button";

export default function Page() {
  const [tiers, setTiers] = useState(
    [...new Array(5)].map((value, index) => {
      return { value: index + 1, label: "" };
    })
  );
  const { register, handleSubmit } = useForm();

  return (
    <div className="flex flex-col items center">
      <form
        className="flex flex-col items-center gap-4"
        action={createNewTierlist}
      >
        {tiers?.map((tier) => {
          return (
            <>
              <label>{`Tier${tier.value}`}</label>
              <input
                type="text"
                placeholder="Label your tier"
                className="input input-bordered w-full max-w-xs"
                {...register(`${tier.value}`)}
              />
            </>
          );
        })}
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
