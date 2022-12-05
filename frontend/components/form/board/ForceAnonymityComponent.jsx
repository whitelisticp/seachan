export const ForceAnonymityComponent = function ({
  register,
  forceAnonymityChecked,
  setForceAnonymityChecked,
}) {
  return (
    <label className="horizontal-margin" title="force anonymity">
      <input
        name="forceAnonymity"
        {...register("forceAnonymity")}
        type="checkbox"
        className="horizontal-margin"
        checked={forceAnonymityChecked}
        value={forceAnonymityChecked}
        onChange={() => {
          setForceAnonymityChecked(!forceAnonymityChecked)
        }}
      />
      Disallow Posting with Principal
    </label>
  )
}
