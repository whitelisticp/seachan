export async function sendIcp(
  actor,
  receiverPrincipal,
  donationAmountIcp,
  postKey = "",
  setIcpReceived,
) {
  const donationAmount = donationAmountIcp * 100_000_000
  try {
    await window?.ic?.plug?.requestConnect()
    const balances = await window.ic?.plug?.requestBalance()
    const iCPBalance = balances[0].amount
    if (iCPBalance >= donationAmountIcp) {
      const requestTransferArg = {
        to: receiverPrincipal,
        amount: donationAmount,
      }
      const transfer = await window.ic?.plug?.requestTransfer(
        requestTransferArg,
      )
      if (transfer["height"]) {
        if (postKey != "") {
          actor.recordIcpTip(postKey, donationAmountIcp).then((post) => {
            if (post["ok"]) {
              alert("Transfer height", transfer["height"])
              alert(
                donationAmountIcp + " ICP sent to the owner of post " + postKey,
              )
              setIcpReceived(post["ok"].icpReceived.toFixed(2))
            } else {
              alert("error", post["err"])
            }
          })
        } else {
          alert("Thank you based anon!")
        }
      }
    } else {
      alert("Plug wallet doesn't have enough balance")
    }
  } catch (error) {
    alert("Plug wallet action has been declined")
  }
}
