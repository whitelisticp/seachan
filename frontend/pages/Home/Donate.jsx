import React, { useState } from 'react'
import { sendIcp } from '../../utils/sendIcp';

const Donate = ({ actor }) => {
    const recieverPrincipal = '982cdeb9bc1f5bb0a8f0dd0f25ea9be46cec91b9684c773dc5d9654674e089ef';
    const donationAmountICP = 1;
    const [donateLoading, setDonateLoading] = useState(false);

    return (
        <div style={{ textAlign: "center", padding: "1em 0" }}>
            <button
                onClick={async () => {
                    setDonateLoading(true)
                    await sendIcp(actor, recieverPrincipal, donationAmountICP, "")
                    setDonateLoading(false)
                }}
                style={{ backgroundColor: "var(--post-header-color)", color: "var(--text-color)", fontSize: "16px" }}
                disabled={donateLoading}
            >
                {!donateLoading ? "Donate 1 ICP to the developer" : "Processing..."}
            </button>
        </div>
    )
}
export default Donate