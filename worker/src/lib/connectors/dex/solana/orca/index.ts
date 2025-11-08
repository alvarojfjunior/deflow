import axios from "axios";

const getPools = async () => {
  const { data } = await axios.get(
    "https://stats-api.mainnet.orca.so/api/whirlpools?limit=100&sort=tvl:desc"
  );

  const formatedPools = data.data.map((pool: any) => ({
    yieldOverTvl24h: parseFloat(pool.yieldOverTvl24h),
    yieldOverTvl7d: parseFloat(pool.yieldOverTvl7d),
    yieldOverTvl30d: parseFloat(pool.yieldOverTvl30d),
    averageTvl: (pool.yieldOverTvl24h + pool.yieldOverTvl7d + pool.yieldOverTvl30d) / 3,
    volumeUsdc24h: parseFloat(pool.volumeUsdc24h),
    volumeUsdc7d: parseFloat(pool.volumeUsdc7d),
    volumeUsdc30d: parseFloat(pool.volumeUsdc30d),
    averageVolumeUsdc: (pool.volumeUsdc24h + pool.volumeUsdc7d + pool.volumeUsdc30d) / 3,
    feesUsdc24h: parseFloat(pool.feesUsdc24h),
    feesUsdc7d: parseFloat(pool.feesUsdc7d),
    feesUsdc30d: parseFloat(pool.feesUsdc30d),
    averageFeesUsdc: (pool.feesUsdc24h + pool.feesUsdc7d + pool.feesUsdc30d) / 3,
    tvlUsdc: parseFloat(pool.tvlUsdc),
    yieldOverTvl: parseFloat(pool.yieldOverTvl),
  }));
  return formatedPools;
};

const getPoolById = async (address: string) => {
  return address;
};

const getUserPositions = async (address: string) => {
  return address;
};

const addLiquidity = async (address: string) => {
  return address;
};

const removeLiquidity = async (address: string) => {
  return address;
};

export default {
  getPools,
  getPoolById,
  getUserPositions,
  addLiquidity,
  removeLiquidity,
} as const;
