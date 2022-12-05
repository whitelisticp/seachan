import { formatCycles } from "../utils/formatCycles"
import { TRILLION } from "../constants"

export async function contributeCycles(
  cycleSendAmount,
  statBackendCycleBalance,
  setStatBackendCycleBalance,
  statFrontendCycleBalance,
  setStatFrontendCycleBalance,
) {
  const cycleConversion = cycleSendAmount * TRILLION
  const params = {
    to:
      statBackendCycleBalance > statFrontendCycleBalance
        ? process.env.SEACHAN_BACKEND_CANISTER_ID
        : process.env.SEACHAN_FRONTEND_CANISTER_ID,
    amount: cycleConversion,
  }
  try {
    window.ic.plug.requestBurnXTC(params).then((result) => {
      if (statBackendCycleBalance > statFrontendCycleBalance) {
        setStatBackendCycleBalance(
          formatCycles(
            parseFloat(statBackendCycleBalance) + parseFloat(cycleSendAmount),
          ),
        )
      } else {
        setStatFrontendCycleBalance(
          formatCycles(
            parseFloat(statFrontendCycleBalance) + parseFloat(cycleSendAmount),
          ),
        )
      }
      console.log(result)
    })
  } catch (error) {
    alert(error)
  }
}
