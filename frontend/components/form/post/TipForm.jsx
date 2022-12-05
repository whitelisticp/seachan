import React, { useState } from "react"
import { sendIcp } from "../../../utils/sendIcp"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"

const TipForm = ({ actor, post, setShowTipForm, setIcpReceived }) => {
  let [icpTipAmount, setIcpTipAmount] = useState(1)
  const { register, handleSubmit, reset } = useForm()

  const handleChange = (event) => {
    event.target.value.replace(/^0+(?!\.|$)/, "")
  }

  const onSubmit = async () => {
    sendIcp(
      actor,
      post.ownerPrincipal.toString(),
      icpTipAmount,
      post.boardAbbreviation + "/" + post.id,
      setIcpReceived,
    )
    setShowTipForm(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="inline"
      autoComplete="off"
    >
      <input
        type="number"
        step="any"
        min=".1"
        max="10"
        id="tipAmountInput"
        onchange={handleChange}
        value={icpTipAmount.toString()}
        {...register("icpTipAmount")}
        onChange={(e) => {
          setIcpTipAmount(Number(e.target.value))
        }}
        style={{ width: "3.2em", height: "20px" }}
      />
      <span
        style={{
          marginLeft: ".3rem",
          marginRight: ".3rem",
        }}
      >
        ICP
      </span>
      <button
        type="submit"
        style={{
          padding: "0px",
          margin: "0px",
          background: "none",
          border: "none",
        }}
      >
        <FontAwesomeIcon
          title="Send"
          style={{ color: "var(--text-color)", cursor: "pointer" }}
          className="horizontal-padding"
          icon={faPaperPlane}
        />
      </button>
      <span
        onClick={() => {
          alert(
            `You can send between 0.1 and 10 ICP at this time using the Plug wallet. The transaction may take up to 10 minutes to appear in the Plug wallet`,
          )
        }}
        style={{ cursor: "pointer" }}
      >
        ?
      </span>
    </form>
  )
}
export default TipForm
