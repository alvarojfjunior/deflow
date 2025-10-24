import axios from "axios";

const getPools = async () => {
  const { data } = await axios.get(
    "https://stats-api.mainnet.orca.so/api/whirlpools?limit=100&sort=tvl:desc"
  );
  return data.data;
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
