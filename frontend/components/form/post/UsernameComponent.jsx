import { getCondensedPrincipal } from "../../../utils/getCondensedPrincipal"

export const UsernameComponent = function ({
    register,
    user,
    board,
    isEditPost,
    post,
  }) {
    return (
      <>
        <label>Post as</label>
        <select required name="userName" {...register("userName")}>
          {/* anon */}
          <option
            value={JSON.stringify({ type: "anonymous", value: "Anonymous" })}
          >
            Anonymous
          </option>
          {/* principal */}
          {user && !board?.forceAnonymity && (
            <option
              value={JSON.stringify({
                type: "principal",
                value: user.principal.toString(),
              })}
            >
              Principal: {getCondensedPrincipal(user.principal.toString())}
            </option>
          )}
          {/* username */}
          {user?.userNames.length > 0 &&
            !board?.forceAnonymity &&
            user?.userNames.map((userName) => {
              return (
                <option
                  value={JSON.stringify({ type: "userName", value: userName })}
                >
                  Username: {userName}
                </option>
              )
            })}
        </select>
        <br />
      </>
    )
  }
  