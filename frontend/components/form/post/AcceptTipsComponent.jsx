export const AcceptTipsComponent = function ({
  register,
  user,
  board,
  acceptTipsChecked,
  setAcceptTipsChecked,
}) {
  if (user?.principalSource == "plug" || user?.principalSource == "stoic") {
    return (
      <label className="horizontal-margin">
        <input
          name="acceptTips"
          {...register("acceptTips")}
          type="checkbox"
          className="horizontal-margin"
          checked={acceptTipsChecked}
          value={acceptTipsChecked}
          disabled={!user || board?.forceAnonymity}
          onChange={() => {
            setAcceptTipsChecked(!acceptTipsChecked)
          }}
        />
        Accept ICP?{" "}
        <span style={{ fontSize: ".8rem" }}>
          {!user && "Sign in required"}{" "}
        </span>
      </label>
    )
  }
}
