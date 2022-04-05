import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [lp, setLp] = useState<string>(); // dropdown, AVAX/USDC etc
  const [amount1, setAmount1] = useState<number>(); // editable, num
  const [amount2, setAmount2] = useState<number>(); // editable, num
  const [poolLiquidity, setPoolLiquidity] = useState<number>(); // editable, num

  const [veJoeShare, setVeJoeShare] = useState(); // editable number
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState(); // editable number

  const [joePerSecond, setJoePerSecond] = useState(); // noneditable number, not shown
  const [poolTotalFactor, setPoolTotalFactor] = useState(); // noneditable number, not shown

  useEffect(() => {}, []);
  return (
    <div className="App">
      <header className="App-header">
        <div className="card">
          <h3>Title</h3>
          <select
            name=""
            id="select"
            value={lp}
            onChange={(e) => {
              setLp(e.target.value);
            }}
          >
            <option value="">Select...</option>
            {[{ name: "AVAX/USDC", value: "AVAX/USDC" }].map((lp) => {
              return (
                <option key={lp.value} value={lp.value}>
                  {lp.name}
                </option>
              );
            })}
          </select>
          {/* <div className="amounts"> */}
          <label htmlFor="">Amount 1 (this should change)</label>{" "}
          <input
            type="number"
            value={amount1}
            onChange={(e) => {
              //@ts-ignore
              setAmount1(e.target.value);
            }}
          />
          <label htmlFor="">Amount 2 (this should change)</label>
          <input
            type="number"
            value={amount2}
            onChange={(e) => {
              //@ts-ignore
              setAmount2(e.target.value);
            }}
          />
          {/* </div> */}
          <label htmlFor="">Pool Liquidity</label>
          <input
            type="number"
            value={poolLiquidity}
            onChange={(e) => {
              //@ts-ignore
              setPoolLiquidity(e.target.value);
            }}
          />
          <p>Pool share: 123%</p>
          <label htmlFor="">veJoe share (this should change)</label>
          <input
            type="number"
            value={veJoeShare}
            onChange={(e) => {
              //@ts-ignore
              setVeJoeShare(e.target.value);
            }}
          />
          <label htmlFor="">Total veJOE supply</label>
          <input
            type="number"
            value={totalVeJoeSupply}
            onChange={(e) => {
              //@ts-ignore
              setTotalVeJoeSupply(e.target.value);
            }}
          />
          <div id="">
            <p>veJOE share: 123</p>
            <p>base APR: 123</p>
            <p>current boosted APR: 123</p>
            <p>estimated boosted APR: 123</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
