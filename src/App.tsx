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
import { getIssuance, getJoePrice, getPairPrice, revertToJLP } from "./lib/pairs";
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ConnectWallet } from "./components/ConnectWallet";

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
  const [poolTVL, setPoolTVL] = useState<number>(0);
  const [lpOptions, setLpOptions] = useState<LpOption[]>([]);

  const [selectedPool, setSelectedPool] = useState<LpOption | null>(null);
  const [joePrice, setJoePrice] = useState<number>(0);
  const [currentBoostedAPR, setCurrentBoostedAPR] = useState<number>(0);
  const getTotalJlpBalance = () => {
    return +jlpBalance + +jlpIssuance;
  };
  const [myWallet, setWallet] = useState<string>(wallet);
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
      const price = await getJoePrice();
      console.log("JOE:" + price);
      setJoePrice(price);
    }
    getData();
  }, []);

  const refreshVeJoeBalance = async () => {
    const balance = await veJoeContract.balanceOf(wallet);

    setOriginalVeJoeBalance(balance / 10e18);
    setVeJoeBalance(balance / 10e18);
  };

  const refreshTokens = async () => {
    if (selectedPool === undefined) return;
    const issuance = await getIssuance(selectedPool!.poolData, unmodifiedJLPBalance);
    setAmount1(issuance["token0"]);
    setAmount2(issuance["token1"]);
  }

  useEffect(() => {
    async function getData() {
      const lps = await getLPs();
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
    }
    getData();
  }, []);

  useEffect(() => {
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
    <ThirdwebProvider desiredChainId={43114}>
    <div className="App">
      <header className="App-header">
        <div className={`card relative ${cardShown ? "" : "hidden"}`}>
          <div className="cb">
            <div className="titleRow">
              <h3>Boosted Farm Calculator</h3>
              <div id="wallet">
                <ConnectWallet/>
              </div>
            </div>
            <div className="body">
              <div className="farm-input">
                  <div style={{ marginBottom: "15px", width: "100%"}}>
                    <label htmlFor="">Address:</label>
                    <input
                      style={{width:"80%"}}
                      value={myWallet}
                      onChange={async (e) => {
                        //@ts-ignore
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
                  setPoolTVL((await getPairPrice(item.poolData.lpToken)).pairs[0].reserveUSD);
                }}
              />
              <button
                    onClick={refreshTokens}
                    className="refresh-button"
                  >
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
                      //@ts-ignore
                      setAmount1(e.target.value);
                      const pair = await returnPairPrice(
                        Number.parseFloat(e.target.value),
                        selectedPool?.poolData.lpContract,
                        true
                      );
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
                      const pair = await returnPairPrice(
                        Number.parseFloat(e.target.value),
                        selectedPool?.poolData.lpContract,
                        false
                      );
                      setAmount1(pair);
                      setJlpBalance(await revertToJLP(selectedPool!.poolData, pair, Number.parseFloat(e.target.value)))
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
                  onChange={async (e) => {
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
            <footer>
              {totalJPS &&
                selectedPool?.poolData.allocPoint &&
                totalAllocPoint &&
                [
                  [
                    "Pool share",
                    `${((100 * (jlpBalance || 0)) / (totalJlpSupply || 0)).toFixed(5)}%`,
                  ],
                  [
                    "veJOE share",
                    `${((100 * (veJoeBalance || 0)) / (totalVeJoeSupply || 0)).toFixed(5)}%`,
                  ],
                  [
                    "Base APR (Joe Per Year)",
                    getBaseAPR(
                      totalJPS,
                      totalAllocPoint,
                      jlpBalance,
                      selectedPool,
                      joePrice,
                      poolTVL * ((jlpBalance || 0) / (totalJlpSupply || 0))
                    ).toFixed(5) +"%",
                  ],
                  [
                    "Currented Boosted APR",
                    getBoostedAPR(
                      totalJPS,
                      totalAllocPoint,
                      unmodifiedJLPBalance,
                      selectedPool,
                      originalVeJoeBalance,
                      joePrice,
                      poolTVL * ((unmodifiedJLPBalance || 0) / (totalJlpSupply || 0))
                    ).toFixed(5) + "%",
                  ],
                  [
                    "Estimated Boosted APR",
                    getBoostedAPR(
                      totalJPS,
                      totalAllocPoint,
                      jlpBalance,
                      selectedPool,
                      veJoeBalance,
                      joePrice,
                      poolTVL * ((jlpBalance || 0) / (totalJlpSupply || 0))
                    ).toFixed(5) + "%",
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
        </div>
      </header>
    </div>
    </ThirdwebProvider>
  );
}

export default App;
