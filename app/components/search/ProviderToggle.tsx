import { type Dispatch, type SetStateAction, useState } from "react"

export default function ProviderToggle({handleProviderToggle}: {handleProviderToggle: Dispatch<SetStateAction<boolean>>}) {
    const [toggled, setToggled] = useState(true)
    return (
        <div className="flex flex-row">
            <div className="form-control w-52">
              <label className="cursor-pointer label">
                <span className="label-text">Show Netflix only</span>
                <input type="checkbox" className="toggle toggle-success" checked={toggled} onChange={() => {
                    setToggled(!toggled)
                    handleProviderToggle(!toggled)
                }}/>
              </label> 
            </div>
          </div>
    )
}