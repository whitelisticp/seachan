import React, { useState } from "react"

export const FileInputComponent = function ({
  register,
  board,
  fileNsfwChecked,
  setFileNsfwChecked,
  createType,
}) {
  const [fileAttached, setFileAttached] = useState(false)
  const isNotRequiredBoard = ["meta", "p"].includes(board?.abbreviation)
  const required = createType == "thread" || isNotRequiredBoard
  const accept = board?.textOnly
    ? ".pdf, .txt"
    : ".jpg, .jpeg, .png, .webp, .jfif, .gif, .svg, .mp4, .mov, .webm, .mp3, .wav, .flac, .pdf, .txt"
  const info =
    board?.textOnly &&
    "File must be .pdf or .txt since this is a text only board"
  return (
    <>
      {info}
      <input
        onClick={() => setFileAttached((fileAttached) => !fileAttached)}
        required={required}
        type="file"
        name="file"
        id="file"
        accept={accept}
        {...register("file")}
      />
      {
        //nsfw check box
        fileAttached && (
          <label className="horizontal-margin" title="fileNsfw">
            <input
              name="fileNsfw"
              {...register("fileNsfw")}
              type="checkbox"
              className="horizontal-margin"
              checked={fileNsfwChecked}
              value={fileNsfwChecked}
              onChange={() => {
                setFileNsfwChecked(!fileNsfwChecked)
              }}
            />
            NSFW
          </label>
        )
      }
      <br />
      {
        //upload via ipfs or asset canister
        <span>
          Upload File Via:
          <br />
          <label style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <input
              style={{ paddingRight: "5px" }}
              type="radio"
              name="fileUploadIpfs"
              defaultChecked
            />
            IPFS
          </label>
          <label>
            <input
              style={{ paddingRight: "5px" }}
              type="radio"
              name="fileUploadIcAssetCanister"
              disabled
            />
            IC Asset Canister (Coming Soon)
          </label>
        </span>
      }
    </>
  )
}
