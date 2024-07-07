"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Stats from "./Stats";
import BarChart from "./Bar";
import { Button } from "@/app/components/ui/Button";

export default function SimulationContainer({
  chartData,
}: {
  chartData: UserChartData;
}) {
  const [repetitions, setRepetitions] = useState(
    chartData.data.reduce((prev, curr) => {
      return prev + curr.movies;
    }, 0)
  );

  const { data, mutate } = useMutation({
    mutationFn: async () => {
      let res = await fetch("/api/draw", {
        method: "POST",
        body: JSON.stringify({ repetitions }),
      });
      let body = await res.json();
      return body;
    },
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <input
        type="number"
        value={repetitions}
        placeholder="Type here"
        className="input input-bordered max-w-fit"
        onChange={(event) => setRepetitions(parseInt(event.target.value))}
      />
      <Button onClick={() => mutate()}>Submit</Button>
      {data && (
        <>
          <Stats chartData={data} />
          <BarChart chartData={data} />
        </>
      )}
    </div>
  );
}
