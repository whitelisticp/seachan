export const GatedComponent = async function ({
  register,
  gatedChecked,
  setGatedChecked,
  gateType,
  setGateType,
}) {
  return (
    <>
      <label className="horizontal-margin" title="gated">
        <input
          name="gated"
          {...register("gated")}
          type="checkbox"
          className="horizontal-margin"
          checked={gatedChecked}
          value={gatedChecked}
          onChange={() => {
            setGatedChecked(!gatedChecked)
          }}
        />
        Gated
      </label>
      <br />
      {gatedChecked && (
        <>
          <label className="horizontal-margin" title="gate type">
            Gate Type:
            <select
              className="horizontal-margin"
              name="gateType"
              {...register("gateType")}
              onChange={(event) => setGateType(event.target.value)}
            >
              <option value=""></option>
              <option value="tokens">tokens</option>
              <option value="nft">nft</option>
            </select>
          </label>
          <br />
        </>
      )}

      {/* gate token and amount */}
      {gatedChecked && gateType == "tokens" && (
        <>
          <br />
          <label className="horizontal-margin" title="gate token">
            Token Amount:
            <input
              style={{ width: "5rem" }}
              className="horizontal-margin"
              type="number"
              name="gateTokenAmount"
              {...register("gateTokenAmount")}
            ></input>
            <select
              className="horizontal-margin"
              name="gateToken"
              {...register("gateToken")}
            >
              <option value="ICP">ICP</option>
            </select>
          </label>
          <br />
        </>
      )}
      {gatedChecked && gateType == "nft" && (
        <>
          <label className="horizontal-margin" title="gate token">
            Gate NFT:
            <select
              className="horizontal-margin"
              name="gateToken"
              {...register("gateToken")}
            >
              <option value="Motoko Day Drop">Motoko Day Drop</option>
            </select>
          </label>
          <br />
        </>
      )}
    </>
  )
}
