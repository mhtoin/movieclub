import { useEffect } from "react";

export const useChosenMovieListener = () => {
  const source = new EventSource("/api/chooseMovie");
  console.log("source", source);
  useEffect(() => {
    console.log("notifier running");
    source.addEventListener("update", (event) => {
      const data = JSON.parse(event.data);
      console.log("notifier", data);
    });
  }, []);
};
