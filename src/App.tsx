import "./App.css";
import { useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getContract, getProvider } from "./lib";

function App() {
  const [lp, setLp] = useState<string>(); // dropdown, AVAX/USDC etc
  const [amount1, setAmount1] = useState<number>(); // editable, num
  const [amount2, setAmount2] = useState<number>(); // editable, num
  const [poolLiquidity, setPoolLiquidity] = useState<number>(); // editable, num

  // Balance, total supply, share
  const [veJoeBalance, setVeJoeBalance] = useState<BigNumber>(); // editable number
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState<BigNumber>(); // editable number
  const [veJoeShare, setVeJoeShare] = useState<BigNumber>(); // editable number

  // JLP
  const [JlpBalance, setJlpBalance] = useState<BigNumber>(); // editable number
  const [totalJlpSupply, setTotalJlpSupply] = useState<BigNumber>(); // editable number
  const [JlpShare, setJlpShare] = useState<BigNumber>(); // editable number

  const [joePerSecond, setJoePerSecond] = useState<number>(); // noneditable number, not shown
  const [poolTotalFactor, setPoolTotalFactor] = useState<number>(); // noneditable number, not shown

  const [baseAPR, setBaseAPR] = useState<number>();

  const [cardShown, setCardShown] = useState<boolean>(true);

  const [provider, setProvider] = useState<JsonRpcProvider>();

  const [jlpContract, setJlpContract] = useState<Contract>();
  const [veJoeContract, setVeJoeContract] = useState<Contract>();

  const [wallet, setWallet] = useState(
    "0xca2229d1ad243d398cc59c8efde6c6c4fc32c57f"
  );

  useEffect(() => {
    const p = getProvider();
    setProvider(p);

    setVeJoeContract(getContract(p, "vejoe"));
    setJlpContract(getContract(p, "jlp"));
  }, []);

  useEffect(() => {
    // console.log(provider);

    async function getData() {
      // VeJoe Stuff
      setVeJoeBalance(await veJoeContract?.balanceOf(wallet));
      setTotalVeJoeSupply(await veJoeContract?.totalSupply());

      // JLP Balance
      setJlpBalance(await jlpContract?.balanceOf(wallet));
      setTotalJlpSupply(await jlpContract?.totalSupply());

      // const poolshare = await jlpContract?.poolShare(wallet);
    }

    getData();
  }, [jlpContract, veJoeContract, wallet]);

  return (
    <div className="App">
      <header className="App-header">
        <div className={`card ${cardShown ? "" : "hidden"}`}>
          <label htmlFor="">Wallet</label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => {
              //@ts-ignore
              setWallet(e.target.value);
            }}
          />
          <h3 style={{padding:"8px 0px"}}>Lorem Ipsum Calculator</h3>
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
          <label htmlFor="">Wallet Balance</label>
          <input
            type="number"
            value={poolLiquidity}
            onChange={(e) => {
              //@ts-ignore
              setPoolLiquidity(e.target.value);
            }}
          />
          <label htmlFor="">Pool Liquidity</label>
          <input
            type="number"
            value={poolLiquidity}
            onChange={(e) => {
              //@ts-ignore
              setPoolLiquidity(e.target.value);
            }}
          />
          <p>
            Pool share:{" "}
            {/* {(JlpBalance?.toNumber() / parseInt(totalJlpSupply)).toString()}% */}
            {(JlpBalance?.toNumber() || 0) / (totalJlpSupply?.toNumber() || 1)}%
          </p>
          <label htmlFor="">veJoe share (this should change)</label>
          {/* <input
            type="number"
            value={veJoeBalance}
            onChange={(e) => {
              //@ts-ignore
              setVeJoeBalance(e.target.value);
            }}
          /> */}
          <label htmlFor="">Total veJOE supply</label>
          {/* <input
            type="number"
            value={totalVeJoeSupply}
            onChange={(e) => {
              //@ts-ignore
              setTotalVeJoeSupply(e.target.value);
            }}
          /> */}
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
