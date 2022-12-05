
export const StickiedComponent = function ({
    register,
    stickiedChecked,
    setStickiedChecked,
  }) {
    return (
      <label className="horizontal-margin" title="stickied">
        <input
          name="stickied"
          {...register("stickied")}
          type="checkbox"
          className="horizontal-margin"
          checked={stickiedChecked}
          value={stickiedChecked}
          onChange={() => {
            setStickiedChecked(!stickiedChecked)
          }}
        />
        Sticky
      </label>
    )
  }