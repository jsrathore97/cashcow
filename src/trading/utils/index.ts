/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Pair } from "../../../generated/templates/Pair/Pair";

export let BI_ZERO = BigInt.fromI32(0);
export let BI_ONE = BigInt.fromI32(1);
export let BD_ZERO = BigDecimal.fromString("0");
export let BD_1E18 = BigDecimal.fromString("1e18");

export let TRACKED_PAIRS: string[] = [
  "0xf7329f9066334556cf6f58bc4b73702237a033b7 ", // WBNB/BUSD cng
  "0x30b7b2861b686178a1eec1233c8f2c626098430f ", // CAKE/WBNB cng
  "0x547758e80ef01d10bb50634bcc1867da71eb9955 ", // ETH/WBNB cng
  "0x9ff56acc85eac3a9f91873884a9b5cf2ddd99d64 ", // BTCB/WBNB cng
];

export function getBnbPriceInUSD(): BigDecimal {
  // Bind WBNB/BUSD contract to query the pair.
  let pairContract = Pair.bind(Address.fromString(TRACKED_PAIRS[0]));

  // Fail-safe call to get BNB price as BUSD.
  let reserves = pairContract.try_getReserves();
  if (!reserves.reverted) {
    let reserve0 = reserves.value.value0.toBigDecimal().div(BD_1E18);
    let reserve1 = reserves.value.value1.toBigDecimal().div(BD_1E18);

    if (reserve0.notEqual(BD_ZERO)) {
      return reserve1.div(reserve0);
    }
  }

  return BD_ZERO;
}
