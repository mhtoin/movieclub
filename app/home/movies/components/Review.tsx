"use client";
import { useState, useTransition } from "react";
import { createReviewAction } from "../actions/actions";

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
  const [value, setValue] = useState(reviewedByUser?.content);
  let [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {movie.reviews.map((movieItem, index) => {
          return (
            <div key={movieItem.id} className={`chat chat-${index % 2 === 0 ? "start" : "end"}`}>  
              <div className="chat-header py-1">{movieItem.user.name}</div>
              <div className={`chat-bubble chat-bubble-primary`}>{movieItem.content}</div>
            </div>
          );
        })}
      </div>
      {!reviewedByUser && (
        <div className="form-control">
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
                if (movie && value) {
                  const createdReview = createReviewAction(
                    value,
                    movie.id ?? ""
                  );
                }
              })
            }
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}
