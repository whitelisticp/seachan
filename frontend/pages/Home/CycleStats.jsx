import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import InfoPost from "../../components/ui/InfoPost"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faQuestion,
  faHandHoldingHeart,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"
import { seachan_backend } from "../../../src/declarations/seachan_backend"
import { formatCycles } from "../../utils/formatCycles"
import { contributeCycles } from "../../utils/contributeCycles"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const CycleStats = ({ actor }) => {
  const [showSendCycleForm, setShowSendCycleForm] = useState(false)
  const [isFrontendLoading, setFrontendLoading] = useState(false)
  const [isBackendLoading, setBackendLoading] = useState(false)
  const [refreshStats, setRefreshStats] = useState(false)
  const [statBackendCycleBalance, setStatBackendCycleBalance] = useState(0)
  const [statFrontendCycleBalance, setStatFrontendCycleBalance] = useState(0)
  const [cycleSendAmount, setCycleSendAmount] = useState(1)
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    setBackendLoading(true)
    seachan_backend.getBackendCycleBalance().then((backendCycleBalance) => {
      setStatBackendCycleBalance(formatCycles(backendCycleBalance))
      setBackendLoading(false)
    })
  }, [refreshStats])

  useEffect(() => {
    setFrontendLoading(true)
    seachan_backend.getFrontendCycleBalance().then((frontendCycleBalance) => {
      setStatFrontendCycleBalance(formatCycles(frontendCycleBalance))
      setFrontendLoading(false)
    })
  }, [refreshStats])

  const handleChange = (event) => {
    event.target.value.replace(/^0+(?!\.|$)/, "")
  }

  const onSubmit = async () => {
    contributeCycles(
      cycleSendAmount,
      statBackendCycleBalance,
      setStatBackendCycleBalance,
      statFrontendCycleBalance,
      setStatFrontendCycleBalance,
    )
    setShowSendCycleForm(false)
  }

  return (
    <InfoPost
      id="cycleStats"
      minimize={false}
      refresh={refreshStats}
      setRefresh={setRefreshStats}
      postHeaderText={
        <>
          <span>Cycles</span>

          <FontAwesomeIcon
            onClick={() => {
              alert(
                `Cycles are used to power this dapp. 
The backend (data) canister has ${statBackendCycleBalance} cycles. 
The frontend (website assets) canister has a balance of ${statFrontendCycleBalance} cycles.
Users can send between .1 and 10 trillion cycles at a time using the XTC token in the Plug app.
XTC can be swapped for ICP at https://app.sonic.ooo/swap.
`,
              )
            }}
            style={{ marginLeft: "10px", cursor: "pointer" }}
            icon={faQuestion}
          />

          {!isFrontendLoading && !isBackendLoading && (
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              title="Send Cycles"
              onClick={() => setShowSendCycleForm(!showSendCycleForm)}
              className="pointer horizontal-padding"
              icon={faHandHoldingHeart}
            />
          )}
        </>
      }
      postBodyText={
        <>
          <div
            style={{
              display: "flex",
              background: "var(--post-bg-color)",
              justifyContent: "center",
              columnGap: ".5rem",
              color: "var(--text-color)",
              overflow: "auto",
            }}
          >
            <span title={process.env.SEACHAN_FRONTEND_CANISTER_ID}>
              Frontend:{" "}
              {isFrontendLoading ? (
                <LoadingSpinner isSmall={true} />
              ) : (
                statFrontendCycleBalance + " T"
              )}
            </span>
            <br />
            <span title={process.env.SEACHAN_BACKEND_CANISTER_ID}>
              Backend:{" "}
              {isBackendLoading ? (
                <LoadingSpinner isSmall={true} />
              ) : (
                statBackendCycleBalance + " T"
              )}
            </span>
          </div>
          {showSendCycleForm && !isFrontendLoading && !isBackendLoading && (
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="inline"
                autoComplete="off"
              >
                <span
                  style={{
                    marginLeft: ".3rem",
                    marginRight: ".3rem",
                  }}
                >
                  Contribute
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="10"
                  id="cycleAmountInput"
                  onchange={handleChange}
                  value={cycleSendAmount.toString()}
                  {...register("cycleSendAmount")}
                  onChange={(e) => {
                    setCycleSendAmount(Number(e.target.value))
                  }}
                  style={{ width: "3.2em", height: "20px" }}
                />
                <span
                  style={{
                    marginLeft: ".3rem",
                    marginRight: ".3rem",
                  }}
                >
                  T Cycles
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
                    icon={faArrowRight}
                  />
                </button>
              </form>
            </div>
          )}
        </>
      }
    />
  )
}
export default CycleStats
