import React, { useState } from "react"
import { Spinner } from "react-bootstrap"

const LoadingSpinner = ({ isSmall }) => {
  return (
    <Spinner
      className="spinner"
      animation="border"
      role="status"
      size={isSmall && "sm"}
    ></Spinner>
  )
}
export default LoadingSpinner
