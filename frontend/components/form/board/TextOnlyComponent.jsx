export const TextOnlyComponent = function ({
    register,
    textOnlyChecked,
    setTextOnlyChecked,
  }) {
    return (
      <label className="horizontal-margin" title="text only">
        <input
          name="textOnly"
          {...register("textOnly")}
          type="checkbox"
          className="horizontal-margin"
          checked={textOnlyChecked}
          value={textOnlyChecked}
          onChange={() => {
            setTextOnlyChecked(!textOnlyChecked)
          }}
        />
        Text Only
      </label>
    )
  }