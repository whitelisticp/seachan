import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { TextOnlyComponent } from "./TextOnlyComponent"
import { ListedComponent } from "./ListedComponent"
import { ForceAnonymityComponent } from "./ForceAnonymityComponent"
import { GatedComponent } from "./GatedComponent"
import { refreshBoardList } from "../../../utils/refreshBoardList"

const BoardForm = ({ setListedBoards, actor, setShowCreateBoardForm }) => {
  const [textOnlyChecked, setTextOnlyChecked] = useState(false)
  const [listedChecked, setListedChecked] = useState(true)
  const [forceAnonymityChecked, setForceAnonymityChecked] = useState(false)
  const [gatedChecked, setGatedChecked] = useState(false)
  const [gateType, setGateType] = useState("")
  const [gateToken, setGateToken] = useState("")
  const [createBoardLoading, setCreateBoardLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const handleBoardCreate = async (data) => {
    setCreateBoardLoading(true)
    const newBoard = {
      abbreviation: data.abbreviation,
      name: data.name,
      textOnly: textOnlyChecked,
      forceAnonymity: forceAnonymityChecked,
      inDevelopment: false,
      showFlags: false,
      gated: gatedChecked,
      gateType: typeof data.gateType === "undefined" ? "" : data.gateType,
      gateToken: typeof data.gateToken === "undefined" ? "" : data.gateToken,
      gateTokenAmount:
        typeof data.gateTokenAmount == "undefined"
          ? 0
          : Number(data.gateTokenAmount),
      listed: data.listed === "true",
    }
    await actor.createBoard(newBoard).then((createdBoard) => {
      if (createdBoard["ok"]) {
        refreshBoardList(setListedBoards)
        setCreateBoardLoading(false)
        setShowCreateBoardForm(false)
      } else {
        alert(createdBoard["err"])
        setCreateBoardLoading(false)
        setShowCreateBoardForm(false)
      }
    })
  }
  return (
    <form onSubmit={handleSubmit(handleBoardCreate)} autoComplete="off">
      <br />
      <label>Abbreviation</label>
      <br />
      <input
        type="text"
        className="horizontal-margin"
        name="abbreviation"
        pattern="[a-zA-Z]*"
        required
        {...register("abbreviation")}
      />
      <br />
      <br />
      <label>Name</label>
      <br />
      <input
        type="text"
        className="horizontal-margin"
        name="name"
        required
        {...register("name")}
      />
      <br />
      {/* text only */}
      <br />
      <TextOnlyComponent
        register={register}
        textOnlyChecked={textOnlyChecked}
        setTextOnlyChecked={setTextOnlyChecked}
      />
      {/* listed */}
      <br />
      <ListedComponent
        register={register}
        listedChecked={listedChecked}
        setListedChecked={setListedChecked}
      />

      {/* anonymity */}
      <br />
      <ForceAnonymityComponent
        register={register}
        forceAnonymityChecked={forceAnonymityChecked}
        setForceAnonymityChecked={setForceAnonymityChecked}
      />

      {/* gated */}
      <br />
      <GatedComponent
        register={register}
        gatedChecked={gatedChecked}
        setGatedChecked={setGatedChecked}
        gateType={gateType}
        setGateType={setGateType}
        gateToken={gateToken}
        setGateToken={setGateToken}
      />
      <br />
      <button
        className="success horizontal-margin"
        disabled={createBoardLoading}
        type="submit"
      >
        {!createBoardLoading ? "Create" : "Creating..."}
      </button>
    </form>
  )
}

export default BoardForm
