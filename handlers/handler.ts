import { NewLPMinted } from '../generated/MetaDefender/LiquidityCertificate';
import {LiquidityCertificate, LiquidityMedal} from '../generated/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts'
import {NewMedalMinted} from "../generated/MetaDefender/LiquidityMedal";

export function handleNewLPMinted(event: NewLPMinted): void {
    updateLiquidityCertificate(event.params.owner, event.params.certificateId, event.params.timestamp, event.params.expiryTime, event.params.liquidity, event.params.rewardDebt, event.params.shadowDebt)
    return
}

export function handleNewMedalMinted(event:NewMedalMinted): void {
    updateLiquidityMedal(event.params.medalId, event.params.enteredAT , event.params.exitedAt, event.params.liquidity, event.params.reserve, event.params.shadowDebt, event.params.marketShadow)
    return
}

function updateLiquidityCertificate(owner:String, certificateId: BigInt, timestamp: BigInt, expiryTime: BigInt, liquidity:BigInt, rewardDebt: BigInt, shadowDebt: BigInt): void {
    let entity = LiquidityCertificate.load(certificateId.toString())
    if (entity == null) {
        entity = new LiquidityCertificate(certificateId.toString())
    }
    entity.owner = owner;
    entity.certificateId = certificateId;
    entity.timestamp = timestamp;
    entity.expiryTime = expiryTime;
    entity.liquidity = liquidity;
    entity.rewardDebt = rewardDebt;
    entity.shadowDebt = shadowDebt;
    entity.save()
    return
}


function updateLiquidityMedal(medalId: BigInt, enteredAt:BigInt, exitedAt: BigInt, liquidity: BigInt, reserve:BigInt, shadowDebt: BigInt, marketShadow:BigInt): void {
    let entity = LiquidityMedal.load(medalId.toString())
    if (entity == null) {
        entity = new LiquidityMedal(medalId.toString())
    }
    entity.medalId = medalId;
    entity.enteredAt = enteredAt;
    entity.exitedAt= exitedAt;
    entity.liquidity = liquidity;
    entity.reserve = reserve;
    entity.shadowDebt = shadowDebt;
    entity.marketShadow = marketShadow;
    entity.save()
    return
}
