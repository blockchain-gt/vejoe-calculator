import { BigNumber } from "ethers";
import { Contract } from "ethers";
export type LpOption = {
  title: string;
  images: string[];
  index: number;
  poolData: {
    lpToken: any;
    lpContract: any;
    token0: any;
    token0Contract: Contract;
    token0Symbol: any;
    token0Name: any;
    token0Decimals: any;
    token1: any;
    token1Contract: Contract,
    token1Symbol: any;
    token1Name: any;
    token1Decimals: any;
    totalSupply: number;
    allocPoint: BigNumber;
    totalFactor: number;
  };
};
