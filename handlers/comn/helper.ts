import { BigDecimal, BigInt, log } from '@graphprotocol/graph-ts';

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString('0');
export const ONE_BD = BigDecimal.fromString('1');
export const BI_18 = BigInt.fromI32(18);
export const BD_18 = BigDecimal.fromString('1000000000000000000');

export function convertTokenToDecimal(
    tokenAmount: bigint,
    exchangeDecimals: bigint,
): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal();
    }
    return tokenAmount
        .toBigDecimal()
        .div(exponentToBigDecimal(exchangeDecimals));
}

export function exponentToBigDecimal(decimals: bigint): BigDecimal {
    let bd = BigDecimal.fromString('1');
    for (let i = ZERO_BI; i.lt(decimals as bigint); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString('10'));
    }
    return bd;
}
