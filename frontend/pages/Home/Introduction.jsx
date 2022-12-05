import React from "react"
import { Link } from "react-router-dom"
import InfoPost from "../../components/ui/InfoPost"

const Introduction = () => {
  return (
    <InfoPost
      id="intro"
      minimize={false}
      postHeaderText={"Welcome to Seachan"}
      postBodyText={
        <>
          Seachan is a decentralized, censorship-resistant, social platform
          built on the{" "}
          <a
            style={{ textDecoration: "underline" }}
            href="https://internetcomputer.org/"
            target="_blank"
          >
            Internet Computer
          </a>
          .<br />
          Users are not required to connect a wallet in order to post, but many
          web3 features become unlocked if you choose to do so.
          <br />
          Once Seachan reaches the desired level of maturity, it will be
          DAO-ified into a self-sustaining, community-directed Dapp.
          <br />
          As a DAO, users will be able to guide the direction of Seachan through
          polls, proposals, and site participation.
          <br />
          For more information on Seachan, please visit the
          <Link style={{ textDecoration: "underline" }} to={"/meta"}>
            /meta/
          </Link>
          board.
          <br />
        </>
      }
    />
  )
}
export default Introduction
