export const LockedComponent = function ({
    register,
    lockedChecked,
    setLockedChecked,
  }) {
    return (
      <label className="horizontal-margin" title="locked">
        <input
          name="locked"
          {...register("locked")}
          type="checkbox"
          className="horizontal-margin"
          checked={lockedChecked}
          value={lockedChecked}
          onChange={() => {
            setLockedChecked(!lockedChecked)
          }}
        />
        Lock
      </label>
    )
  }
  