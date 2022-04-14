import {
  getLPs,
  getPoolInfo,
  getReserves,
  returnPairPrice,
  totalAllocPoint,
  totalJPS,
  veJoeContract,
  wallet as defaultWallet,
} from "./lib/three";
import "./App.css";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import { LpOption } from "./lib/three/types";
import {
  getIssuance,
  getJoePrice,
  getPairPrice,
  revertToJLP,
} from "./lib/three/index";

import Statbox from "./components/Statbox";
import RefreshButton from "./components/RefreshButton";

function App() {
  const [amount1, setAmount1] = useState<number>(0); // editable, num
  const [amount2, setAmount2] = useState<number>(0); // editable, num

  // Balance, total supply, share
  const [veJoeBalance, setVeJoeBalance] = useState<number>(0);
  const [originalVeJoeBalance, setOriginalVeJoeBalance] = useState<number>(0);
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState<number>(0);
  const [originalJlpBalance, setOriginalJlpBalance] = useState<number>(0);
  // JLP
  const [jlpBalance, setJlpBalance] = useState<number>(0);
  const [totalJlpSupply, setTotalJlpSupply] = useState<number>(0);
  const [jlpIssuance, setJlpIssuance] = useState<number>(0);
  const [poolTVL, setPoolTVL] = useState<number>(0);
  const [poolReserves, setPoolReserves] = useState<number>(0);
  const [selectedPool, setSelectedPool] = useState<LpOption | null>(null);
  const [joePrice, setJoePrice] = useState<number>(0);

  // Options shown in the dropdown
  const [lpOptions, setLpOptions] = useState<LpOption[]>([]);

  // The wallet of the user
  const [wallet, setWallet] = useState<string>(defaultWallet);

  const getTotalJlpBalance = () => {
    return +jlpBalance + +jlpIssuance;
  };

  useEffect(() => {
    //on page load
    async function getData() {
      const balancePromise = veJoeContract.balanceOf(wallet);
      const totalSupplyPromise = veJoeContract.totalSupply();
      const lpsPromise = getLPs();
      const joePricePromise = getJoePrice();

      const [balance, totalSupply, lps, price] = await Promise.all([
        await balancePromise,
        await totalSupplyPromise,
        await lpsPromise,
        await joePricePromise,
      ]);

      const options = lps.map((lp, i) => ({
        title: `${lp.token0Symbol}/${lp.token1Symbol}`,
        images: [
          `/symbols/${lp.token0Symbol || "default"}.png`,
          `/symbols/${lp.token1Symbol || "default"}.png`,
        ],
        index: i,
        poolData: lp,
      }));

      setLpOptions(options);
      setSelectedPool(options[0]);
      setOriginalVeJoeBalance(balance / 10e18);
      setVeJoeBalance(balance / 10e18);
      setTotalVeJoeSupply(totalSupply / 10e18);
      setJoePrice(price);
    }
    getData();
  }, [wallet]); // needs to change when the data is changeed

  const refreshVeJoeBalance = async () => {
    const balance = await veJoeContract.balanceOf(wallet);

    setOriginalVeJoeBalance(balance / 10e18);
    setVeJoeBalance(balance / 10e18);
  };

  const refreshTokens = async () => {
    if (selectedPool === undefined) return;
    const issuance = await getIssuance(
      selectedPool!.poolData,
      originalJlpBalance,
      poolReserves
    );
    setAmount1(issuance["token0"]);
    setAmount2(issuance["token1"]);
  };

  // Run when new pool selected
  useEffect(() => {
    async function getData() {
      setTotalJlpSupply(selectedPool!.poolData.totalSupply);
      const reservesPromise = getReserves(selectedPool!.poolData);
      const poolInfoPromise = getPoolInfo(selectedPool!.index, wallet);
      const [reserves, poolInfo] = await Promise.all([
        await reservesPromise,
        await poolInfoPromise,
      ]);
      setPoolReserves(reserves);
      setOriginalJlpBalance(poolInfo.amount);
      setJlpBalance(poolInfo.amount);
      const issuance = getIssuance(
        selectedPool!.poolData,
        poolInfo.amount,
        reserves
      );
      setAmount1(issuance["token0"]);
      setAmount2(issuance["token1"]);
    }
    if (selectedPool) getData();
  }, [selectedPool, wallet]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="card relative">
          <div className="cb">
            <div className="titleRow">
              <h3>Boosted Farm Calculator</h3>
              <div id="wallet"></div>
            </div>
            <div className="body">
              <div className="farm-input">
                <div style={{ marginBottom: "15px", width: "100%" }}>
                  <label htmlFor="">Address:</label>
                  <input
                    style={{ width: "80%" }}
                    value={wallet}
                    onChange={async (e) => {
                      setWallet(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Dropdown
                options={lpOptions}
                onSelect={async (item) => {
                  if (selectedPool === item) return;
                  setSelectedPool(item);
                  setPoolTVL(
                    (await getPairPrice(item.poolData.lpToken)).pairs[0]
                      .reserveUSD
                  );
                }}
              />
              <button onClick={refreshTokens} className="refresh-button">
                Refresh
              </button>

              <div className="farm-input">
                <img src={selectedPool?.images[0]} alt="" />
                <div style={{ marginLeft: "10px" }}>
                  <label htmlFor="">{selectedPool?.title.split("/")[0]}</label>
                  <input
                    type="number"
                    value={amount1}
                    onChange={async (e) => {
                      setAmount1(Number.parseFloat(e.target.value));
                      const pair = await returnPairPrice(
                        Number.parseFloat(e.target.value),
                        selectedPool?.poolData.lpContract,
                        true
                      );
                      setAmount2(pair);
                      setJlpBalance(
                        await revertToJLP(
                          selectedPool!.poolData,
                          Number.parseFloat(e.target.value),
                          pair,
                          poolReserves
                        )
                      );
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
                      setAmount2(Number.parseFloat(e.target.value));
                      const pair = await returnPairPrice(
                        Number.parseFloat(e.target.value),
                        selectedPool?.poolData.lpContract,
                        false
                      );
                      setAmount1(pair);
                      setJlpBalance(
                        await revertToJLP(
                          selectedPool!.poolData,
                          pair,
                          Number.parseFloat(e.target.value),
                          poolReserves
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div className="input">
                <label htmlFor="">
                  veJOE Balance <RefreshButton onClick={refreshVeJoeBalance} />
                </label>
                <input
                  type="number"
                  value={veJoeBalance}
                  onChange={async (e) => {
                    setVeJoeBalance(Number(e.target.value));
                  }}
                />
              </div>
              <div className="input">
                <label htmlFor="">Total veJOE Supply</label>
                <input
                  disabled
                  type="number"
                  value={totalVeJoeSupply}
                  onChange={async (e) => {
                    setAmount2(Number(e.target.value));
                    const pair = await returnPairPrice(
                      Number.parseFloat(e.target.value),
                      selectedPool?.poolData.lpContract,
                      false
                    );
                    setAmount1(pair);
                    setJlpBalance(
                      await revertToJLP(
                        selectedPool!.poolData,
                        pair,
                        Number.parseFloat(e.target.value),
                        poolReserves
                      )
                    );
                  }}
                />
              </div>
            </div>
            <footer>
              <Statbox
                {...{
                  totalJlpSupply,
                  totalJPS,
                  joePrice,
                  veJoeBalance,
                  selectedPool,
                  totalAllocPoint,
                  jlpBalance,
                  poolTVL,
                  totalVeJoeSupply,
                  originalJLPBalance: originalJlpBalance,
                  originalVeJoeBalance,
                }}
              />
            </footer>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
