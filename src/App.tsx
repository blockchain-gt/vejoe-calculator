import {
  getBaseAPR,
  getBoostedAPR,
  getLPs,
  getUserInfo,
  getUserJLPBalance,
  returnPairPrice,
  totalAllocPoint,
  totalJPS,
  veJoeContract,
  wallet,
} from "./lib/three";
import "./App.css";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import Dropdown from "./components/Dropdown";
import { LpOption } from "./lib/three/types";
import { getIssuance, revertToJLP } from "./lib/pairs";
//import { ThirdwebProvider } from '@thirdweb-dev/react';

function App() {
  const [amount1, setAmount1] = useState<number>(0); // editable, num
  const [amount2, setAmount2] = useState<number>(0); // editable, num

  // Balance, total supply, share
  const [veJoeBalance, setVeJoeBalance] = useState<number>(0); // editable number
  const [originalVeJoeBalance, setOriginalVeJoeBalance] = useState<number>(0); // editable number
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState<number>(0); // editable number
  const [unmodifiedJLPBalance, setUnmodified] = useState<number>(0);
  // JLP
  const [jlpBalance, setJlpBalance] = useState<number>(0); // editable number
  const [totalJlpSupply, setTotalJlpSupply] = useState<number>(0); // editable number
  const [jlpIssuance, setJlpIssuance] = useState<number>(0);
  const [cardShown, setCardShown] = useState<boolean>(true);

  const [lpOptions, setLpOptions] = useState<LpOption[]>([]);

  const [selectedPool, setSelectedPool] = useState<LpOption | null>(null);
  const getTotalJlpBalance = () => {
    return +jlpBalance + +jlpIssuance;
  }
  useEffect(() => {
    async function getData() {
      const balancePromise = veJoeContract.balanceOf(wallet);
      const totalSupplyPromise = veJoeContract.totalSupply();
      const [balance, totalSupply] = await Promise.all([
        await balancePromise,
        await totalSupplyPromise,
      ]);

      setOriginalVeJoeBalance(balance / 10e18);
      setVeJoeBalance(balance / 10e18);
      setTotalVeJoeSupply(totalSupply / 10e18);
    }
    getData();
  }, []);

  const refreshVeJoeBalance = async () => {
    const balance = await veJoeContract.balanceOf(wallet);

    setOriginalVeJoeBalance(balance / 10e18);
    setVeJoeBalance(balance / 10e18);
  };

  useEffect(() => {
    async function getData() {
      const lps = await getLPs();
      const options = lps.map((lp, i) => ({
        title: `${lp.token0Symbol}/${lp.token1Symbol}`,
        images: [
          `/symbols/${lp.token0Symbol}.png`,
          `/symbols/${lp.token1Symbol}.png`,
        ],
        index: i,
        poolData: lp,
      }));

      setLpOptions(options);

      setSelectedPool(options[0]);
    }
    getData();
  }, []);

  useEffect( () => {
    if (selectedPool) {
      setTotalJlpSupply(selectedPool.poolData.totalSupply);
      getUserJLPBalance(selectedPool?.index, wallet, selectedPool?.poolData).then(
        async (bal) => {
          setUnmodified(bal);
          setJlpBalance(bal);
          const issuance = (await getIssuance(selectedPool.poolData, bal))
          setAmount1(issuance["token0"]);
          setAmount2(issuance["token1"]);
        }
      );

    }
  }, [selectedPool]);


  return (
    <div className="App">
      <header className="App-header">
        <div className={`card relative ${cardShown ? "" : "hidden"}`}>
          <h3>Boosted Farm Calculator</h3>
          <div className="body">
          <h6>{(selectedPool?.poolData.lpContract ?? "").toString()}</h6>
            <Dropdown
              options={lpOptions}
              onSelect={(item) => {
                setSelectedPool(item);
              }}
            />
            <div className="input">
              <label htmlFor="">Wallet JLP Balance</label>
              <input
                disabled
                type="number"
                value={(jlpBalance / 10e18).toFixed(20)}
              />
            </div>
            <div className="farm-input">
              <img src={selectedPool?.images[0]} alt="" />
              <div style={{ marginLeft: "10px" }}>
                <label htmlFor="">{selectedPool?.title.split("/")[0]}</label>
                <input
                  type="number"
                  value={amount1}
                  onChange={async (e) => {
                    //@ts-ignore
                    setAmount1(e.target.value);
                    const pair = await returnPairPrice(Number.parseFloat(e.target.value), selectedPool?.poolData.lpContract, true);
                    setAmount2(pair);
                    setJlpBalance(await revertToJLP(selectedPool!.poolData, Number.parseFloat(e.target.value), pair));
                  }}
                />
              </div>
            </div>
            <div className="farm-input">
              <img src={selectedPool?.images[1]} alt="" />
              <div style={{ marginLeft: "10px" }}>
                <label htmlFor="">{selectedPool?.title.split("/")[1]}</label>
                <input
                  type="number"
                  value={amount2}
                  onChange={async (e) => {
                    //@ts-ignore
                    setAmount2(e.target.value);
                    const pair = await returnPairPrice(Number.parseFloat(e.target.value), selectedPool?.poolData.lpContract, false);
                    setAmount1(pair);
                    setJlpBalance(await revertToJLP(selectedPool!.poolData, pair, Number.parseFloat(e.target.value)));
                  }}
                />
              </div>
            </div>
            <div className="input">
              <label htmlFor="">
                veJOE Balance{" "}
                <button
                  onClick={refreshVeJoeBalance}
                  className="refresh-button"
                >
                  Refresh
                </button>
              </label>
              <input
                type="number"
                value={veJoeBalance}
                onChange={(e) => {
                  //@ts-ignore
                  setVeJoeBalance(e.target.value);
                  //@ts-ignore
                }}
              />
            </div>
            <div className="input">
              <label htmlFor="">Total veJOE Supply</label>
              <input
                disabled
                type="number"
                value={totalVeJoeSupply}
                onChange={(e) => {
                  //@ts-ignore
                  setTotalVeJoeSupply(e.target.value);
                }}
              />
            </div>
          </div>
          <footer>
            {totalJPS &&
              selectedPool?.poolData.allocPoint &&
              totalAllocPoint &&
              [
                [
                  "Pool share",
                  `${(100 * (jlpBalance || 0)) / (totalJlpSupply || 0)}%`,
                ],
                [
                  "veJOE share",
                  `${(100 * (veJoeBalance || 0)) / (totalVeJoeSupply || 0)}%`,
                ],
                [
                  "Base APR (Joe Per Year)",

                  getBaseAPR(
                    totalJPS,
                    totalAllocPoint,
                    jlpBalance,
                    selectedPool
                  ),
                ],
                [
                  "Currented Boosted APR (Joe Per Year)",
                  getBoostedAPR(
                    totalJPS,
                    totalAllocPoint,
                    unmodifiedJLPBalance,
                    selectedPool,
                    originalVeJoeBalance
                  ),
                ],
                [
                  "Estimated Boosted APR (Joe Per Year)",
                  getBoostedAPR(
                    totalJPS,
                    totalAllocPoint,
                    jlpBalance,
                    selectedPool,
                    veJoeBalance
                  ),
                  "Test",
                ],
              ].map(([label, value, tooltip]) => (
                <div className="statbox">
                  <p>
                    {label}
                    {/* {tooltip && <Tooltip text="test" />} */}
                  </p>

                  <p>{value}</p>
                </div>
              ))}
          </footer>
        </div>
      </header>
    </div>
  );
}

export default App;
