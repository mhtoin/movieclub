import { useState } from "react";

export default function RatingHeart({checked, onChange}: {checked: boolean, onChange: any}) {
    const [isChecked, setIsChecked] = useState(checked)

    return (
        <input
        type="radio"
        name="rating-10"
        className="bg-red-400 mask mask-heart mask-half-1"
        checked={isChecked}
        onChange={onChange}
      />
    )
}