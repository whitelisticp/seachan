import React from "react"

export const ListedComponent = function ({
  register,
  listedChecked,
  setListedChecked,
}) {
  return (
    <label className="horizontal-margin" title="listed on homepage">
      <input
        name="listed"
        {...register("listed")}
        type="checkbox"
        className="horizontal-margin"
        checked={listedChecked}
        value={listedChecked}
        onChange={() => {
          setListedChecked(!listedChecked)
        }}
      />
      Listed
    </label>
  )
}
