"use client";
import { useState, useTransition } from "react";
import { createReviewAction } from "../actions/actions";
import { Prisma } from "@prisma/client";

export default function Review({
  movie,
  user,
}: {
  movie: MovieOfTheWeek;
  user: User;
}) {
  const reviewedByUser = movie.reviews.find(
    (review) => review.userId === user.userId
  );
  const [value, setValue] = useState(reviewedByUser);
  let [isPending, startTransition] = useTransition();

  console.log("review movie", movie, value);
  
  return (
    <>
    <div className="flex flex-col items-center align-baseline justify-start">
      {movie.reviews.map((movieItem, index) => {
        return (
          <>
            <div className={`chat chat-${index % 2 === 0 ? 'start' : 'end'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={movieItem.user.image} />
                </div>
              </div>
              <div className="chat-header p-2">
                {movieItem.user.name}
                <time className="text-xs opacity-50 p-2">12:45</time>
              </div>
              <div className="chat-bubble">{movieItem.content}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          </>
        );
      })}
      </div>
      {!reviewedByUser && <div className="form-control" onSubmit={() => console.log("submitted")}>
        <label className="label">
          <span className="label-text">Your thoughts</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Write a review in a few sentences"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        ></textarea>
        <label className="label"></label>
        <button
          type="submit"
          className="label-text-alt btn max-w-fit"
          disabled={!value || reviewedByUser ? true : false}
          onClick={() =>
            startTransition(() => {
              if (movie) {
                const createdReview = createReviewAction(value, movie.id ?? "");
                console.log("creation response", createReviewAction);
              }
            })
          }
        >
          Submit
        </button>
      </div>}
    </>
  );
}
