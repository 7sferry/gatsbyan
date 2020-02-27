import React from "react"

import "./header.css"
import bioImg from "../../images/ferry.jpg"
import Mobsoc from "./MobileSocialLinks"

const MobileBio = (props) => {

    return (<>
        <Mobsoc contacts={props.contacts}/>
        <div className="mobile-bio-main">
            <img src={bioImg} className="ml-4 mt-2" style={{ maxWidth: `75px`, maxHeight: `75px`, borderRadius: `50%`,boxShadow: `1px 1px 3px`}} alt="author-pic" />
            <p className="ml-3 mt-2 mb-0">
              <h4 className="mb-1">{props.author}</h4>
              <h7>{props.tagline}</h7>
            </p>
        </div></>
    )
};

export default MobileBio
