"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createNewTierlist, recreateTierlist } from "../../actions/actions";

export default function CreateForm() {
  const [tiers, setTiers] = useState(
    [...new Array(5)].map((value, index) => {
      return { value: index + 1, label: "" };
    })
  );
  const { register, handleSubmit } = useForm();

  return (
    <>
    
    <dialog id="createModal" className="modal modal-bottom sm:modal-middle">
      <div className="flex flex-col items center">
        <form
          method="dialog"
          className="flex flex-col items-center gap-4"
          action={recreateTierlist}
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
          <button className="btn btn-success" type="submit">
            Create
          </button>
        </form>
      </div>
    </dialog>
    </>
  );
}
