import {
  getLPs,
  getPoolInfo,
  getReserves,
  returnPairPrice,
  totalAllocPoint,
  totalJPS,
  veJoeContract,
  wallet as defaultWallet,
} from "./lib/web3";
import "./App.css";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import { LpOption } from "./lib/web3/types";
import {
  getIssuance,
  getJoePrice,
  getPairPrice,
  revertToJLP,
} from "./lib/web3/index";

import Statbox from "./components/Statbox";
import RefreshButton from "./components/RefreshButton";
declare var window: any;

function App() {
  const [amount1, setAmount1] = useState<number>(0);
  const [amount2, setAmount2] = useState<number>(0);

  // Balance, total supply, share
  const [veJoeBalance, setVeJoeBalance] = useState<number>(0);
  const [originalVeJoeBalance, setOriginalVeJoeBalance] = useState<number>(0);
  const [totalVeJoeSupply, setTotalVeJoeSupply] = useState<number>(0);
  const [originalJlpBalance, setOriginalJlpBalance] = useState<number>(0);

  // JLP
  const [jlpBalance, setJlpBalance] = useState<number>(0);
  const [totalJlpSupply, setTotalJlpSupply] = useState<number>(0);
  const [poolTVL, setPoolTVL] = useState<number>(0);
  const [poolReserves, setPoolReserves] = useState<number>(0);
  const [selectedPool, setSelectedPool] = useState<LpOption | null>(null);
  const [joePrice, setJoePrice] = useState<number>(0);

  // Options shown in the dropdown
  const [lpOptions, setLpOptions] = useState<LpOption[]>([]);

  // The wallet of the user
  const [wallet, setWallet] = useState<string>(defaultWallet);

  const [cardShown, setCardShown] = useState<boolean>(false);

  useEffect(() => {
    //on page load
    async function getData() {
      const balancePromise = veJoeContract.balanceOf(wallet);
      const totalSupplyPromise = veJoeContract.totalSupply();
      const lpsPromise = getLPs();
      const joePricePromise = getJoePrice();

      const [balance, totalSupply, lps, price] = await Promise.all([
        balancePromise,
        totalSupplyPromise,
        lpsPromise,
        joePricePromise,
      ]);

      const options = lps.map((lp, i) => ({
        title: `${lp.token0Symbol}/${lp.token1Symbol}`,
        images: [
          `/tokens/${lp.token0Symbol.toUpperCase() || "default"}.png`,
          `/tokens/${lp.token1Symbol.toUpperCase() || "default"}.png`,
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

  // TODO: needs to be in useCallback
  const refreshVeJoeBalance = async () => {
    const balance = await veJoeContract.balanceOf(wallet);

    setOriginalVeJoeBalance(balance / 10e18);
    setVeJoeBalance(balance / 10e18);
  };

  // TODO: needs to be in useCallback
  const refreshTokens = () => {
    if (selectedPool === undefined) return;
    const issuance = getIssuance(
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
        reservesPromise,
        poolInfoPromise,
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

  useEffect(() => {
    setTimeout(() => {
      setCardShown(true);
    }, 500);
  }, []);
  async function requestAccount() {
    console.log("Requesting account");

    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
      } catch (e) {}
    } else {
      console.log("not detected");
    }
  }

  return (
    <div className="App">
      <img className="logo" src="/image 1.png" alt="Trader Joe Logo" />
      <header className="App-header">
        <div id="wallet">
          <button onClick={requestAccount}>Connect to MetaMask</button>
        </div>
        <div className={`card relative ${!cardShown ? "hidden" : ""}`}>
          <div className="cb">
            <div className="titleRow">
              <h3>Boosted Farm Calculator</h3>
              <button
                className="close-button"
                onClick={() => setCardShown(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="sc-bbmXgH dlqmhF"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="body">
              <div className="farm-input">
                <div className="input" style={{ marginBottom: "10px" }}>
                  <div id="top-label-refresh">
                    <label htmlFor="">Address</label>
                  </div>
                  <input
                    type="text"
                    value={wallet}
                    onChange={async (e) => {
                      setWallet(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Dropdown
                options={lpOptions}
                onSelect={async (selectedItem) => {
                  if (selectedPool === selectedItem || !selectedItem) return;
                  setSelectedPool(selectedItem);
                  setPoolTVL(
                    (await getPairPrice(selectedItem.poolData?.lpToken))
                      .pairs[0].reserveUSD
                  );
                }}
              />
              <div id="top-label-refresh">
                <label htmlFor="" className="tokenLabel">
                  {selectedPool?.title.split("/")[0] || "Loading..."}
                </label>
                <RefreshButton onClick={refreshTokens} />
              </div>
              <div className="farm-input">
                <div className="_img">
                  <img
                    src={selectedPool?.images[0] || "/tokens/default.png"}
                    alt={selectedPool?.title}
                  />
                </div>
                <div className="_input">
                  <input
                    type="number"
                    value={amount1}
                    onChange={async (e) => {
                      const amount1 = Number.parseFloat(e.target.value);
                      setAmount1(amount1);
                      const pair = await returnPairPrice(
                        amount1,
                        selectedPool?.poolData.lpToken,
                        true
                      );
                      setAmount2(pair);
                      setJlpBalance(
                        revertToJLP(
                          selectedPool!.poolData,
                          amount1,
                          pair,
                          poolReserves
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div id="top-label-refresh">
                <label htmlFor="" className="tokenLabel">
                  {selectedPool?.title.split("/")[1] || "Loading..."}
                </label>
              </div>
              <div className="farm-input">
                <div className="_img">
                  <img
                    src={selectedPool?.images[1] || "/tokens/default.png"}
                    alt={selectedPool?.title}
                  />
                </div>
                <div className="_input">
                  <input
                    type="number"
                    value={amount2}
                    onChange={async (e) => {
                      const amount2 = Number.parseFloat(e.target.value);
                      setAmount2(amount2);
                      const pair = await returnPairPrice(
                        amount2,
                        selectedPool?.poolData.lpToken,
                        false
                      );
                      setAmount1(pair);
                      setJlpBalance(
                        await revertToJLP(
                          selectedPool!.poolData,
                          pair,
                          amount2,
                          poolReserves
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div className="input">
                <div id="top-label-refresh">
                  <label htmlFor="">veJOE Balance</label>
                  <RefreshButton onClick={refreshVeJoeBalance} />
                </div>
                <input
                  type="number"
                  value={veJoeBalance}
                  onChange={async (e) => {
                    setVeJoeBalance(Number(e.target.value));
                  }}
                />
              </div>
              <div className="input">
                <div id="top-label-refresh">
                  <label htmlFor="">Total veJOE Supply</label>
                </div>
                <input
                  disabled
                  type="number"
                  value={totalVeJoeSupply}
                  onChange={async (e) => {
                    setAmount2(Number(e.target.value));
                    const pair = await returnPairPrice(
                      Number(e.target.value),
                      selectedPool?.poolData.lpContract,
                      false
                    );
                    setAmount1(pair);
                    setJlpBalance(
                      await revertToJLP(
                        selectedPool!.poolData,
                        pair,
                        Number(e.target.value),
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
