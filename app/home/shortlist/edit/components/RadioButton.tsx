export default function RadioButton({checked, indexValue, handleCheck}: { checked: boolean, indexValue: number, handleCheck: any }) {
    console.log('radio', checked)
    return (
        <input
        type="radio"
        name="radio-2"
        className="radio radio-accent"
        checked={checked}
        onChange={() => {
            handleCheck(indexValue)
        }}
      />
    )
}