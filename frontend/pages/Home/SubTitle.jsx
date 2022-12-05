import React from 'react'
import { faInfinity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const SubTitle = () => {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.25rem", display: "flex", justifyContent: "center", alignItems: "center" }} >
                CENSORSHIP RESISTANT
            </span>
            <span style={{ fontSize: "1.25rem", marginBottom: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                DECENTRALIZED FILEBOARD
            </span>
            <span style={{ fontSize: ".75rem", fontFamily: 'Helvetica, Arial, sans-serif', display: "flex", justifyContent: "center", alignItems: "center" }}>
                Powered by <FontAwesomeIcon icon={faInfinity} style={{ marginLeft: "10px", marginRight: "10px" }} />Internet Computer
            </span>
        </div>
    )
}

export default SubTitle