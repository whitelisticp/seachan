export const CustomTagComponent = function ({ register }) {
    return (
      <input
        type="text"
        className="horizontal-margin"
        placeholder="Tag"
        name="Tag"
        required
        {...register("customTag")}
      />
    )
  }