"use client"

import RatingHeart from "./RatingHeart";

export default function Rating({movie, user}: {movie: MovieOfTheWeek, user: User}) {
  return (
    <div className="rating rating-sm rating-half ">
     {[...Array(5)].map((item) => {
      return <RatingHeart key={item} checked={false} onChange={() => console.log('hi')} />
     })}
    </div>
  );
}
