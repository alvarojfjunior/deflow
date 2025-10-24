import orca from "./solana/orca";

const connectors = {
  orca,
} as const;

type SupportedBlockchain = keyof typeof connectors;

export const getPools = async (dex: SupportedBlockchain) => {
  if (dex == "orca") {
    return connectors[dex].getPools(dex);
  } else {
    throw new Error("Invalid dex");
  }
};

export const getPoolById = async (dex: SupportedBlockchain) => {
  if (dex == "orca") {
    return connectors[dex].getPoolById(dex);
  } else {
    throw new Error("Invalid dex");
  }
};

export const getUserPositions = async (dex: SupportedBlockchain) => {
  if (dex == "orca") {
    return connectors[dex].getUserPositions(dex);
  } else {
    throw new Error("Invalid dex");
  }
};

export const addLiquidity = async (dex: SupportedBlockchain) => {
  if (dex == "orca") {
    return connectors[dex].addLiquidity(dex);
  } else {
    throw new Error("Invalid dex");
  }
};

export const removeLiquidity = async (dex: SupportedBlockchain) => {
  if (dex == "orca") {
    return connectors[dex].removeLiquidity(dex);
  } else {
    throw new Error("Invalid dex");
  }
};
