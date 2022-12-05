import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserSecret,
  faInfinity,
  faUser,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons"
import { highlightAllPostsById } from "../../../../utils/highlightAllPostsById"
import { getPostCountById } from "../../../../utils/getPostCountById"
import { getCondensedPrincipal } from "../../../../utils/getCondensedPrincipal"
import { getContrast } from "../../../../utils/getContrast"

export const PosterId = function ({
  post,
  posts,
  highlightedPosts,
  setHighlightedPosts,
  onPage,
  postView,
}) {
  var posterIdRole = Object.keys(post.posterId)[0]
  var posterId = Object.values(post.posterId)[0]
  var postsById = getPostCountById(post.posterId, posts, onPage)
  return (
    <>
      <span
        title={
          onPage == "thread" &&
          "Highlight " +
            postsById +
            " post" +
            (postsById != 1 ? "s" : "") +
            " by this ID."
        }
        style={{
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          borderRadius: "50px",
          background: post.posterIdColor,
          color: getContrast(post.posterIdColor),
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-around",
          // gap: ".5rem",
        }}
        onClick={
          onPage == "thread"
            ? () =>
                highlightAllPostsById(
                  post.posterId,
                  posts,
                  highlightedPosts,
                  setHighlightedPosts,
                )
            : () => {}
        }
      >
        {/* poster ID */}
        {posterIdRole != "Admin" && (
          <span
            style={{
              paddingRight: ".3rem",
            }}
          >
            {/* anon */}
            {posterIdRole == "Anon" && (
              <FontAwesomeIcon title="Anon" icon={faUserSecret} />
            )}
            {/* principal */}
            {posterIdRole == "Principal" && (
              <FontAwesomeIcon title="Principal" icon={faInfinity} />
            )}
            {/* user names */}
            {posterIdRole == "UserName" && (
              <FontAwesomeIcon title="UserName" icon={faUser} />
            )}
          </span>
        )}
        <span>
          {/* poster id */}
          {posterIdRole == "Principal"
            ? getCondensedPrincipal(posterId)
            : posterId}
        </span>
        {onPage == "thread" && postsById > 1 ? " (" + postsById + ")" : ""}
      </span>
      {/* copy poster ID */}
      {postView != "list" && (
        <span>
          <FontAwesomeIcon
            icon={faClipboard}
            title="Copy poster ID"
            style={{ cursor: "pointer" }}
            onClick={() => navigator.clipboard.writeText(posterId)}
          />
        </span>
      )}
    </>
  )
}
