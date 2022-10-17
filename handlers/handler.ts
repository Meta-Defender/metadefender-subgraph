import { NewLPMinted } from '../generated/MetaDefender/LiquidityCertificate';
import { LiquidityCertificate } from '../generated/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts'

export function handleNewLPMinted(event: NewLPMinted): void {
    updateEntity(event.params.certificateId, event.params.timestamp, event.params.expiryTime, event.params.liquidity, event.params.rewardDebt, event.params.shadowDebt)
    return
}

function updateEntity(certificateId: BigInt, timestamp: BigInt, expiryTime: BigInt, liquidity:BigInt, rewardDebt: BigInt, shadowDebt: BigInt): void {
    let entity = LiquidityCertificate.load(certificateId.toString())
    if (entity == null) {
        entity = new LiquidityCertificate(certificateId.toString())
        entity.timestamp = timestamp;
        entity.expiryTime = expiryTime;
        entity.liquidity = liquidity;
        entity.rewardDebt = rewardDebt;
        entity.shadowDebt = shadowDebt;
        entity.save()
        return
    } else {
        entity.timestamp = timestamp;
        entity.expiryTime = expiryTime;
        entity.liquidity = liquidity;
        entity.rewardDebt = rewardDebt;
        entity.shadowDebt = shadowDebt;
        entity.save()
        return
    }
}
