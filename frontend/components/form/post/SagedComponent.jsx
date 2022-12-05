export const SagedComponent = function ({
  register,
  sagedChecked,
  setSagedChecked,
}) {
  return (
    <>
      <label className="horizontal-margin" title="saged">
        <input
          name="saged"
          {...register("saged")}
          type="checkbox"
          className="horizontal-margin"
          value={sagedChecked}
          defaultChecked={false}
          onChange={() => {
            setSagedChecked(!sagedChecked)
          }}
        />
        Sage?
        <span style={{ fontSize: ".8rem" }} className="horizontal-margin">
          Prevents thread from getting bumped
        </span>
      </label>
      <br />
    </>
  )
}
