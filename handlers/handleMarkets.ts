import { ByteArray, crypto } from '@graphprotocol/graph-ts';
import { Market } from '../generated/schema';
import {
    MarketAdded,
    MarketRemoved,
} from '../generated/MarketRegistry/MetaDefenderMarketRegistry';
import { LiquidityCertificate, Policy } from '../generated/templates';

export function handleMarketRemoved(event: MarketRemoved): void {
    const bytes = ByteArray.fromUTF8(event.params.metaDefender.toHexString());
    const str = crypto.keccak256(bytes).toHexString();
    const entity = Market.load(str);
    if (entity != null) {
        entity.isValid = false;
        entity.save();
    }
    return;
}
export function handleMarketAdded(event: MarketAdded): void {
    // first create the template of the certain market.
    LiquidityCertificate.create(event.params.liquidityCertificate);
    Policy.create(event.params.policy);
    // then create the market entity.
    const bytes = ByteArray.fromUTF8(event.params.metaDefender.toHexString());
    const str = crypto.keccak256(bytes).toHexString();
    let entity = Market.load(str);
    if (entity == null) {
        entity = new Market(str);
        entity.protocol = event.params.metaDefender.toHexString();
        entity.liquidityCertificate =
            event.params.liquidityCertificate.toHexString();
        entity.policy = event.params.policy.toHexString();
        entity.epochManage = event.params.epochManage.toHexString();
        entity.marketName = event.params.marketName;
        entity.marketDescription = event.params.marketDescription;
        entity.marketPaymentToken = event.params.marketPaymentToken;
        entity.marketProtectionType = event.params.marketProtectionType;
        entity.network = event.params.network;
        entity.isValid = true;
        entity.save();
    }
    return;
}
