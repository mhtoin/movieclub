"use client"
import { useState, useTransition } from "react";
import RadioButton from "./RadioButton";
import { updateSelection } from "../actions/actions";

export default function SelectionRadio({ length, selectedIndex}: { length: number, selectedIndex: number}) {
  const [checked, setChecked] = useState([...new Array(length)].map((value, index) => {
    console.log('index', index)
    return index === selectedIndex
  }))
  let [isPending, startTransition] = useTransition();
  console.log('checked', checked, length, selectedIndex)

  const handleCheck = (index: number) => {
    const nextChecked = checked.map((value, i) => {
      return i === index
    })
    startTransition(() => updateSelection(index))
    setChecked(nextChecked)

  }
  return (
    <div className="form-control flex flex-row gap-5 sm:gap-20 justify-evenly">
     {checked.map((value, index) => {
      return (
        <RadioButton key={index} checked={value} handleCheck={handleCheck} indexValue={index}/>
      )
     })}
    </div>
  );
}
