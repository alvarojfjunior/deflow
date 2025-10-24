export const getImpermanentLoss = (pool: any, userPosition: any) => {
    const { tokenA, tokenB } = pool;
    const { tokenAAmount, tokenBAmount } = userPosition;
    const tokenAPrice = tokenA.price;
    const tokenBPrice = tokenB.price;
    const tokenAAmountInUsd = tokenAAmount * tokenAPrice;
    const tokenBAmountInUsd = tokenBAmount * tokenBPrice;
    const poolValueInUsd = tokenAAmountInUsd + tokenBAmountInUsd;
    const impermanentLoss = (poolValueInUsd - userPosition.valueInUsd) / userPosition.valueInUsd;
    return impermanentLoss;
}


export const estimateRewards = (pool: any, userPosition: any) => {
    const { tokenA, tokenB } = pool;
    const { tokenAAmount, tokenBAmount } = userPosition;
    const tokenAPrice = tokenA.price;
    const tokenBPrice = tokenB.price;
    const tokenAAmountInUsd = tokenAAmount * tokenAPrice;
    const tokenBAmountInUsd = tokenBAmount * tokenBPrice;
    const poolValueInUsd = tokenAAmountInUsd + tokenBAmountInUsd;
    const rewardsInUsd = poolValueInUsd - userPosition.valueInUsd;
    return rewardsInUsd;
}
