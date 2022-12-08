import React from 'react'
import { isMobile } from 'react-device-detect';
import logo from '../../assets/logo.png';

const Logo = () => {
    return (
        <div style={{ marginBottom: "10px" }}>
            <img
                title={"Logo by Ludo (http://thisisludo.com/)"}
                style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: isMobile ? "100%" : "50%" }}
                src={logo}
            />
        </div>
    )
}

export default Logo
