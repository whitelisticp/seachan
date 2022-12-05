import React, { useState } from "react"
import WDCGIF from "../../assets/banners/WDCGIF.gif"
import accumulateIcp from "../../assets/banners/accumulate-icp.gif"
import icpDfinity from "../../assets/banners/icp-dfinity.gif"
import icp1 from "../../assets/banners/icp1.gif"
import moneroWef from "../../assets/banners/monero-wef.jpg"
import moneroBmm from "../../assets/banners/monero-bmm.png"
import web3icp from "../../assets/banners/web3-icp.gif"
import icpPc from "../../assets/banners/icp-pc.gif"
import motokoIcp from "../../assets/banners/motoko-icp.gif"
import motokoDfinity from "../../assets/banners/motoko-dfinity.gif"
import icpOg from "../../assets/banners/icp-og.gif"
import goingOnline from "../../assets/banners/going-onine.gif"
import keanuBtcEth from "../../assets/banners/keanu-btc-eth-icp.gif"
import moneroNote from "../../assets/banners/monero-note.png"
import checkingStatus from "../../assets/banners/checking-status.gif"
import unlockingXMR from "../../assets/banners/unlocking_XMR.gif"
import iSeePee from "../../assets/banners/i-see-pee.gif"
import moneyBurn from "../../assets/banners/money_burn.gif"
import radicalFinancialFreedom from "../../assets/banners/radical-financial-freedom.png"

import { isMobile } from "react-device-detect"

const Banner = () => {
  var ads = [
    // NFTs
    { file: WDCGIF, link: "http://www.wagmidystopianclub.com/" },
    // ICP
    { file: accumulateIcp, link: "https://dfinity.org/" },
    { file: icpDfinity, link: "https://dfinity.org/" },
    { file: icp1, link: "https://dfinity.org/" },
    { file: web3icp, link: "https://dfinity.org/" },
    { file: icpPc, link: "https://dfinity.org/" },
    { file: icpOg, link: "https://dfinity.org/" },
    { file: goingOnline, link: "https://dfinity.org/" },
    { file: keanuBtcEth, link: "https://dfinity.org/" },
    { file: checkingStatus, link: "https://dfinity.org/" },
    { file: iSeePee, link: "https://dfinity.org/" },
    { file: moneyBurn, link: "https://dfinity.org/" },
    // Motoko
    { file: motokoIcp, link: "https://entrepot.app/marketplace/motoko" },
    { file: motokoDfinity, link: "https://entrepot.app/marketplace/motoko" },
    // Monero
    { file: moneroWef, link: "https://www.getmonero.org/" },
    { file: moneroBmm, link: "https://www.getmonero.org/" },
    { file: moneroNote, link: "https://www.getmonero.org/" },
    { file: unlockingXMR, link: "https://www.getmonero.org/" },
    { file: radicalFinancialFreedom, link: "https://www.getmonero.org/" },
  ]

  const [ad] = useState(ads[Math.floor(Math.random() * ads.length)])

  return (
    <span
      style={{
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <a href={ad.link} target="_blank">
        <img
          src={ad.file}
          style={{
            maxWidth: "100%",
            maxHeight: isMobile ? "8rem" : "10rem",
            cursor: "pointer",
          }}
        />
      </a>
    </span>
  )
}

export default Banner
