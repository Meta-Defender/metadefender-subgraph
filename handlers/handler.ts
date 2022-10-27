import {
    LiquidityCertificate,
    LiquidityMedal,
    Policy,
} from '../generated/schema';
import { NewMedalMinted } from '../generated/LiquidityMedal/LiquidityMedal';
import {
    NewLPMinted,
    LPBurned,
} from '../generated/LiquidityCertificate/LiquidityCertificate';
import { NewPolicyMinted } from '../generated/Policy/Policy';
import * as graphTypes from '@graphprotocol/graph-ts';
import { store } from '@graphprotocol/graph-ts';

export function handleNewLPMinted(event: NewLPMinted): void {
    updateLiquidityCertificate(
        event.params.owner,
        event.params.certificateId,
        event.params.timestamp,
        event.params.expiryTime,
        event.params.liquidity,
        event.params.rewardDebt,
        event.params.shadowDebt,
    );
    return;
}

//     event newPolicyMinted(address beneficiary, uint policyId, uint coverage, uint deposit, uint enteredAt, uint expiredAt, uint shadowImpact);

export function handleNewPolicyMinted(event: NewPolicyMinted): void {
    updatePolicy(
        event.params.beneficiary,
        event.params.policyId,
        event.params.coverage,
        event.params.deposit,
        event.params.enteredAt,
        event.params.expiredAt,
        event.params.shadowImpact,
    );
}

export function updatePolicy(
    beneficiary: graphTypes.Address,
    policyId: graphTypes.BigInt,
    coverage: graphTypes.BigInt,
    deposit: graphTypes.BigInt,
    enteredAt: graphTypes.BigInt,
    expiredAt: graphTypes.BigInt,
    shadowImpact: graphTypes.BigInt,
): void {
    let entity = Policy.load(policyId.toString());
    if (entity == null) {
        // in this scenario, the id of the entity is the same as the id of the policy
        entity = new Policy(policyId.toString());
    }
    entity.beneficiary = beneficiary.toHexString();
    entity.policyId = policyId;
    entity.coverage = coverage;
    entity.deposit = deposit;
    entity.enteredAt = enteredAt;
    entity.expiredAt = expiredAt;
    entity.shadowImpact = shadowImpact;
    entity.save();
    return;
}

export function handleLPBurned(event: LPBurned): void {
    deleteLiquidityCertificate(event.params.certificateId);
    return;
}

function deleteLiquidityCertificate(certificateId: graphTypes.BigInt): void {
    const entity = LiquidityCertificate.load(certificateId.toString());
    if (entity != null) {
        store.remove('LiquidityCertificate', certificateId.toString());
    }
    return;
}

export function handleNewMedalMinted(event: NewMedalMinted): void {
    updateLiquidityMedal(
        event.params.owner,
        event.params.medalId,
        event.params.enteredAT,
        event.params.exitedAt,
        event.params.liquidity,
        event.params.reserve,
        event.params.shadowDebt,
        event.params.marketShadow,
    );
    return;
}

function updateLiquidityCertificate(
    owner: graphTypes.Address,
    certificateId: graphTypes.BigInt,
    timestamp: graphTypes.BigInt,
    expiryTime: graphTypes.BigInt,
    liquidity: graphTypes.BigInt,
    rewardDebt: graphTypes.BigInt,
    shadowDebt: graphTypes.BigInt,
): void {
    let entity = LiquidityCertificate.load(certificateId.toString());
    if (entity == null) {
        // in this scenario, the id of the entity is the same as the id of the certificate
        entity = new LiquidityCertificate(certificateId.toString());
    }
    entity.owner = owner.toHexString();
    entity.certificateId = certificateId;
    entity.timestamp = timestamp;
    entity.expiryTime = expiryTime;
    entity.liquidity = liquidity;
    entity.rewardDebt = rewardDebt;
    entity.shadowDebt = shadowDebt;
    entity.save();
    return;
}

function updateLiquidityMedal(
    owner: graphTypes.Address,
    medalId: graphTypes.BigInt,
    enteredAt: graphTypes.BigInt,
    exitedAt: graphTypes.BigInt,
    liquidity: graphTypes.BigInt,
    reserve: graphTypes.BigInt,
    shadowDebt: graphTypes.BigInt,
    marketShadow: graphTypes.BigInt,
): void {
    let entity = LiquidityMedal.load(medalId.toString());
    if (entity == null) {
        // in this scenario, the id of the entity is the same as the id of the medal
        entity = new LiquidityMedal(medalId.toString());
    }
    entity.owner = owner.toHexString();
    entity.medalId = medalId;
    entity.enteredAt = enteredAt;
    entity.exitedAt = exitedAt;
    entity.liquidity = liquidity;
    entity.reserve = reserve;
    entity.shadowDebt = shadowDebt;
    entity.marketShadow = marketShadow;
    entity.save();
    return;
}
