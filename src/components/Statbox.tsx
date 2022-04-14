import { getBaseAPR, getBoostedAPR } from "../lib/three";

interface Props {
  [key: string]: any;
  totalJlpSupply: number;
}

export default function Statbox({
  totalJlpSupply,
  totalJPS,
  joePrice,
  veJoeBalance,
  selectedPool,
  totalAllocPoint,
  jlpBalance,
  poolTVL,
  totalVeJoeSupply,
  originalJLPBalance,
  originalVeJoeBalance,
}: Props) {
  return (
    (totalJPS &&
      selectedPool?.poolData.allocPoint &&
      totalAllocPoint &&
      [
        [
          "Pool share",
          `${((100 * (jlpBalance || 0)) / (totalJlpSupply || 0)).toFixed(5)}%`,
        ],
        [
          "veJOE share",
          `${((100 * (veJoeBalance || 0)) / (totalVeJoeSupply || 0)).toFixed(
            5
          )}%`,
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
          ).toFixed(5) + "%",
        ],
        [
          "Currented Boosted APR",
          getBoostedAPR(
            totalJPS,
            totalAllocPoint,
            originalJLPBalance,
            selectedPool,
            originalVeJoeBalance,
            joePrice,
            poolTVL * ((originalJLPBalance || 0) / (totalJlpSupply || 0))
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
        ],
      ].map(([label, value]) => (
        <div className="statbox">
          <p>{label}</p>
          <p>{value}</p>
        </div>
      ))) ||
    null
  );
}
