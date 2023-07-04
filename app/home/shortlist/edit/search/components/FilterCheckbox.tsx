export default function FilterCheckbox({option} : { option: {id: number, name: string}}) {
    return (
        <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{option?.name}</span>
              <input type="checkbox" checked={false} className="checkbox" />
            </label>
          </div>
    )
}