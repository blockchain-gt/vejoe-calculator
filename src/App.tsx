import { wallet } from "./lib/three/contracts";
import "./App.css";
import { useEffect, useState } from "react";
import { BigNumber, Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getContract, getProvider } from "./lib";
import Dropdown from "./components/Dropdown";
import LineDisplay from "./components/LineDisplay";

type Option = { title: string; images: string[] };

function App() {
  const [lp, setLp] = useState<string>(); // dropdown, AVAX/USDC etc
  const [amount1, setAmount1] = useState<number>(); // editable, num
  const [amount2, setAmount2] = useState<number>(); // editable, num
  const [poolLiquidity, setPoolLiquidity] = useState<number>(); // editable, num

  // Balance, total supply, share
  const [veJoeBalance, setVeJoeBalance] = useState<BigNumber>(); // editable number
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState<BigNumber>(); // editable number

  // JLP
  const [JlpBalance, setJlpBalance] = useState<BigNumber>(); // editable number
  const [totalJlpSupply, setTotalJlpSupply] = useState<BigNumber>(); // editable number

  const [cardShown, setCardShown] = useState<boolean>(true);

  const [provider, setProvider] = useState<JsonRpcProvider>();

  const [jlpContract, setJlpContract] = useState<Contract>();
  const [veJoeContract, setVeJoeContract] = useState<Contract>();

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
    }

    getData();
  }, [jlpContract, veJoeContract]);

  const lpOptions = [
    { title: "AVAX/USDC", images: ["/symbols/avax.png", "/symbols/USDC.png"] },
    { title: "AVAX/1234", images: ["/symbols/avax.png", "/symbols/USDC.png"] },
    { title: "AVAX/TEST", images: ["/symbols/avax.png", "/symbols/USDC.png"] },
  ];
  const [selectedDropdownItem, setSelectedDropdownItem] = useState<Option>(
    lpOptions[0]
  );

  var poolShare = (JlpBalance?.toNumber() || 1) / (totalJlpSupply?.toNumber() || 1);

  return (
    <div className="App">
      <header className="App-header">
        <div className={`card relative ${cardShown ? "" : "hidden"}`}>
          <h3>Boosted Farm Calculator</h3>
          <div className="body">
            {/* <label htmlFor="">Wallet</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => {
                //@ts-ignore
                setWallet(e.target.value);
              }}
            /> */}
            <Dropdown
              options={lpOptions}
              onSelect={(item) => {
                setSelectedDropdownItem(item);
              }}
            />
            {/* <select
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
            </select> */}
            {/* <div className="amounts"> */}
            <div className="farm-input">
              <img src={selectedDropdownItem.images[0]} alt="" />
              <div style={{ marginLeft: "10px" }}>
                <label htmlFor="">
                  {selectedDropdownItem.title.split("/")[0]}
                </label>
                <input
                  type="number"
                  value={amount1}
                  onChange={(e) => {
                    //@ts-ignore
                    setAmount1(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="farm-input">
              <img src={selectedDropdownItem.images[1]} alt="" />
              <div style={{ marginLeft: "10px" }}>
                <label htmlFor="">
                  {selectedDropdownItem.title.split("/")[1]}
                </label>
                <input
                  type="number"
                  value={amount2}
                  onChange={(e) => {
                    //@ts-ignore
                    setAmount2(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* </div> */}
            <label htmlFor="">Wallet Balance</label>
            <input
              type="number"
              value={poolLiquidity}
              onChange={(e) => {
                //@ts-ignore
                setPoolLiquidity(e.target.value);
              }}
              style={{
                width: "90%"
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
              style={{
                width: "90%"
              }}
            />
          </div>
          <footer>
            <LineDisplay title="veJOE Share" value={(veJoeBalance ?? 0).toString()}/>
            <LineDisplay title="Total veJOE Supply" value={(totalVeJoeSupply ?? 0).toString()}/>
            <LineDisplay title="Pool Share" value={poolShare.toFixed(20) + "%"}/>
            <LineDisplay title="Base APR" value={"123"}/>
            <LineDisplay title="Current Boosted APR" value={"123"}/>
            <LineDisplay title="Estimated Boosted APR" value={"123"}/>
            <label htmlFor="">veJoe share (this should change)</label>
            <label htmlFor="">Total veJOE supply</label>
            <div id="Results">
              <p>veJOE share: 123</p>
              <p>base APR: 123</p>
              <p>current boosted APR: 123</p>
              <p>estimated boosted APR: 123</p>
            </div>
          </footer>
        </div>
      </header>
    </div>
  );
}

export default App;
