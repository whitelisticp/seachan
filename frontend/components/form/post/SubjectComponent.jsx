export const SubjectComponent = function ({ register }) {
  return (
    <>
      <br />
      <label>Subject</label>
      <input type="text" name="subject" {...register("subject")} />
    </>
  )
}
