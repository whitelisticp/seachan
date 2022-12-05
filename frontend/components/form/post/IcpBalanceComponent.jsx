import { anonymizeBalance } from "../../../utils/anonymizeBalance"

export const IcpBalanceComponent = function ({
  register,
  user,
  board,
  displayIcpBalanceChecked,
  setDisplayIcpBalanceChecked,
}) {
  return (
    <>
      <label className="horizontal-margin">
        <input
          name="displayIcpBalance"
          {...register("displayIcpBalance")}
          type="checkbox"
          className="horizontal-margin"
          checked={displayIcpBalanceChecked}
          value={displayIcpBalanceChecked}
          disabled={!user || board?.forceAnonymity || user?.icpBalance == 0}
          onChange={() => {
            setDisplayIcpBalanceChecked(!displayIcpBalanceChecked)
          }}
        />
        Display ICP balance?
        {user ? (
          <span style={{ fontSize: ".8rem" }} className="horizontal-margin">
            {user.icpBalance.toFixed(2).toString()} will be displayed as ~
            {anonymizeBalance(user?.icpBalance)}{" "}
          </span>
        ) : (
          <span style={{ fontSize: ".8rem" }} className="horizontal-margin">
            Sign in required
          </span>
        )}
      </label>
    </>
  )
}
