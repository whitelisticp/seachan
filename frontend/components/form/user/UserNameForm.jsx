import React, { useState } from "react"
import { useForm } from "react-hook-form"

export const UserNameForm = ({ actor, setUser, setShowUserNameForm }) => {
  const [isLoading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()
  const handleClaimUserName = async (data) => {
    setLoading(true)
    actor.claimUserName(data.userName).then((claimedUserNameResult) => {
      if (claimedUserNameResult["ok"]) {
        setUser(claimedUserNameResult["ok"])
      } else {
        alert("error", claimedUserNameResult["err"])
      }
      setShowUserNameForm(false)
      setLoading(false)
    })
  }
  return (
    <>
      <form
        style={{ display: "inline" }}
        onSubmit={handleSubmit(handleClaimUserName)}
        autoComplete="off"
      >
        <input
          type="text"
          className="horizontal-margin"
          placeholder="Username"
          name="userName"
          required
          {...register("userName")}
        />
        <button
          className="success horizontal-margin"
          disabled={isLoading}
          type="claim"
        >
          {!isLoading ? "Claim" : "Claiming..."}
        </button>
      </form>
    </>
  )
}
