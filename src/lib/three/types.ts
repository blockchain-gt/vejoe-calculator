import { BigNumber } from "ethers";

export type LpOption = {
  title: string;
  images: string[];
  index: number;
  poolData: {
    totalSupply: number;
    allocPoint: BigNumber;
    totalFactor: BigNumber;
  };
};
