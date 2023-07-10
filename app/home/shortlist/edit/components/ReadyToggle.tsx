"use client"

import { useState } from "react";

export default function ReadyToggle() {
    const [toggled, setToggled] = useState(false)
  return (
    <div className="flex flex-col bg-slate-800 p-2 rounded-md">
      <div className="form-control w-40">
        <label className="cursor-pointer label">
          <span className="label-text">Ready</span>
          <input type="checkbox" className="toggle toggle-success" checked={toggled} onChange={() => setToggled(!toggled)} />
        </label>
      </div>
    </div>
  );
}
