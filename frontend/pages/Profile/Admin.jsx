import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import InfoPost from "../../components/ui/InfoPost"
import { deleteAll } from "../../utils/deleteAll"
import { importData } from "../../utils/importData"
import { exportAll } from "../../utils/exportAll"
import { isAdmin } from "../../utils/isAdmin"
import BoardForm from "../../components/form/board/BoardForm"
import { styles } from "../../styles"

const Admin = ({ user, setUser, setListedBoards, actor, setActor }) => {
  const [isLoading, setLoading] = useState({
    deleteAll: false,
    importData: false,
    exportAll: false,
  })
  const [showCreateBoardForm, setShowCreateBoardForm] = useState(false)
  let navigate = useNavigate()

  return (
    <>
      {/* Seachan Operations */}
      <h1
        style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}
      >
        {Object.keys(user?.role)[0]}
      </h1>
      {isAdmin(user) && (
        <>
          <InfoPost
            minimize={false}
            postHeaderText={"Board Operations"}
            postBodyText={
              <>
                {/* create board */}
                <span>
                  <button
                    onClick={() => setShowCreateBoardForm(!showCreateBoardForm)}
                    className="success"
                  >
                    Create
                  </button>
                  <br />
                </span>
                {showCreateBoardForm && (
                  <BoardForm
                    setListedBoards={setListedBoards}
                    actor={actor}
                    setShowCreateBoardForm={setShowCreateBoardForm}
                  />
                )}
              </>
            }
          />
          <InfoPost
            minimize={false}
            postHeaderText={"Post Operations"}
            postBodyText={
              <>
                {/* sync file counts */}
                <span style={styles.horizontalSpacing}>
                  <button
                    onClick={() => {
                      console.log("starting file count sync")
                      actor.syncThreadFileCount().then(() => {
                        console.log("completed file count sync")
                      })
                    }}
                  >
                    Sync File Counts
                  </button>
                </span>
                {/* sync poster id counts */}
                <span style={styles.horizontalSpacing}>
                  <button
                    onClick={() => {
                      console.log("starting thread poster id count sync")
                      actor.syncPosterIdCount().then(() => {
                        console.log("completed thread poster id count sync")
                      })
                    }}
                  >
                    Sync Thread PosterID Count
                  </button>
                </span>
                {/* assign SeaChad roles */}
                <span style={styles.horizontalSpacing}>
                  <button
                    onClick={() => {
                      console.log("starting SeaChad assignment")
                      actor.assignSeaChadRoles().then(() => {
                        console.log("completed SeaChad assignments")
                      })
                    }}
                  >
                    Assign SeaChad Roles
                  </button>
                </span>
                {/* disallow acceptTips from iC0 users */}
                <span style={styles.horizontalSpacing}>
                  <button
                    onClick={() => {
                      console.log("disallowing ic0 tipping")
                      actor.disallowIc0Tipping().then(() => {
                        console.log("completed disallowing ic0 tipping")
                      })
                    }}
                  >
                    Disallow iC0 tipping
                  </button>
                </span>
                {/* Verify sign in */}
                <span style={styles.horizontalSpacing}>
                  <button
                    onClick={() => {
                      actor.getCaller().then((principal) => {
                        alert("principal: " + principal)
                      })
                    }}
                  >
                    Show Caller Principal
                  </button>
                </span>
              </>
            }
          />
          <InfoPost
            postHeaderText={"Seachan Operations"}
            postBodyText={
              <>
                {/* import all */}
                <span>
                  <label style={{ paddingRight: "5px" }} htmlFor="allImport">
                    {!isLoading.importAll ? "Import All" : "Importing All..."}
                  </label>
                  <input
                    type="file"
                    onChange={importData("all", actor, setLoading)}
                  />
                </span>
                {/* export all */}
                <button
                  onClick={() => exportAll(actor, setLoading)}
                  style={{
                    margin: "5px",
                    backgroundColor: "var(--success-color)",
                    color: "var(--text-color)",
                  }}
                  disabled={isLoading.exportAll}
                >
                  {!isLoading.exportAll ? "Export All" : "Exporting All..."}
                </button>
                {/* delete all */}
                <button
                  onClick={() => {
                    deleteAll(actor, setLoading, setListedBoards)
                    setUser()
                    setActor()
                    navigate("/")
                  }}
                  style={{
                    margin: "5px",
                    backgroundColor: "var(--danger-color)",
                    color: "var(--text-color)",
                  }}
                  disabled={isLoading.deleteAll}
                >
                  {!isLoading.deleteAll ? "Delete All" : "Deleting All..."}
                </button>
              </>
            }
          />
        </>
      )}
      <a id="downloadAnchorElem" style={{ display: "none" }}></a>
    </>
  )
}
export default Admin
