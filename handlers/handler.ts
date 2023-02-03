import { LiquidityCertificate, Market, Policy } from '../generated/schema';
import {
    NewLPMinted,
    Expired,
    Transfer,
} from '../generated/LiquidityCertificate_1/LiquidityCertificate';
import {
    NewPolicyMinted,
    PolicyClaimed,
    PolicySettled,
    PolicyUnderClaimApplying,
} from '../generated/Policy_1/Policy';
import * as graphTypes from '@graphprotocol/graph-ts';
import { BigInt, crypto, ByteArray } from '@graphprotocol/graph-ts';
import {
    MarketAdded,
    MarketRemoved,
} from '../generated/MarketRegistry/MetaDefenderMarketRegistry';

export function handleTransfer(event: Transfer): void {
    const to = event.params.to;
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.tokenId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = LiquidityCertificate.load(str);
    if (entity != null) {
        if (entity.owner != to.toHexString()) {
            entity.owner = to.toHexString();
            entity.save();
        }
    }
    return;
}

export function handleNewLPMinted(event: NewLPMinted): void {
    updateLiquidityCertificate(
        event.params.owner,
        event.params.certificateId,
        event.params.enteredEpochIndex,
        event.params.liquidity,
        event.params.protocol,
        event.address,
    );
    return;
}

function updateLiquidityCertificate(
    owner: graphTypes.Address,
    certificateId: graphTypes.BigInt,
    enteredEpochIndex: graphTypes.BigInt,
    liquidity: graphTypes.BigInt,
    protocol: graphTypes.Address,
    eventAddress: graphTypes.Address,
): void {
    const bytes = ByteArray.fromUTF8(
        eventAddress.toHexString() + certificateId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    let entity = LiquidityCertificate.load(str);
    if (entity == null) {
        // in this scenario, the id of the entity is the same as the id of the certificate
        entity = new LiquidityCertificate(str);
    }
    entity.protocol = protocol.toHexString();
    entity.owner = owner.toHexString();
    entity.certificateId = certificateId;
    entity.enteredEpochIndex = enteredEpochIndex;
    entity.exitedEpochIndex = BigInt.zero();
    entity.rewardDebtEpochIndex = enteredEpochIndex;
    entity.liquidity = liquidity;
    entity.SPSLocked = BigInt.zero();
    entity.isValid = true;
    entity.save();
    return;
}

export function handleLPExpired(event: Expired): void {
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.certificateId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = LiquidityCertificate.load(str);
    if (entity == null) {
        throw new Error('Certificate does not exist');
    }
    entity.isValid = false;
    entity.save();
    return;
}

export function handleNewPolicyMinted(event: NewPolicyMinted): void {
    updatePolicy(
        event.params.beneficiary,
        event.params.policyId,
        event.params.coverage,
        event.params.fee,
        event.params.duration,
        event.params.standardRisk,
        event.params.enteredEpochIndex,
        event.params.SPS,
        event.params.protocol,
        event.params.epochManage,
        event.address,
    );
}

export function handleMarketAdded(event: MarketAdded): void {
    updateMarket(
        event.params.metaDefender,
        event.params.liquidityCertificate,
        event.params.policy,
        event.params.epochManage,
        event.params.marketName,
        event.params.marketDescription,
        event.params.marketPaymentToken,
        event.params.marketProtectionType,
        event.params.network,
        true,
    );
}

export function handleMarketRemoved(event: MarketRemoved): void {
    removeMarket(event.params.metaDefender);
}

export function handlePolicyUnderClaimApplying(
    event: PolicyUnderClaimApplying,
): void {
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.policyId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = Policy.load(str);
    if (entity == null) {
        throw new Error('Policy does not exist');
    }
    entity.isClaimApplying = event.params.status;
    entity.save();
    return;
}

export function handlePolicyClaimed(event: PolicyClaimed): void {
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.policyId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = Policy.load(str);
    if (entity == null) {
        throw new Error('Policy does not exist');
    }
    entity.isClaimed = event.params.status;
    entity.save();
    return;
}

export function handlePolicySettled(event: PolicySettled): void {
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.policyId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = Policy.load(str);
    if (entity == null) {
        throw new Error('Policy does not exist');
    }
    entity.isSettled = event.params.status;
    entity.save();
    return;
}

export function removeMarket(metaDefender: graphTypes.Address): void {
    const entity = Market.load(metaDefender.toHexString());
    if (entity == null) {
        throw new Error('Market does not exist');
    }
    entity.isValid = false;
    entity.save();
    return;
}

export function updateMarket(
    metaDefender: graphTypes.Address,
    liquidityCertificate: graphTypes.Address,
    policy: graphTypes.Address,
    epochManage: graphTypes.Address,
    marketName: string,
    marketDescription: string,
    marketPaymentToken: string,
    protectionType: string,
    network: string,
    isValid: boolean,
): void {
    const bytes = ByteArray.fromUTF8(metaDefender.toHexString());
    const str = crypto.keccak256(bytes).toHexString();
    let entity = Market.load(str);
    if (entity == null) {
        entity = new Market(str);
    }
    entity.protocol = metaDefender.toHexString();
    entity.liquidityCertificate = liquidityCertificate.toHexString();
    entity.policy = policy.toHexString();
    entity.epochManage = epochManage.toHexString();
    entity.marketName = marketName;
    entity.marketDescription = marketDescription;
    entity.marketPaymentToken = marketPaymentToken;
    entity.marketProtectionType = protectionType;
    entity.network = network;
    entity.isValid = isValid;
    entity.save();
    return;
}

export function updatePolicy(
    beneficiary: graphTypes.Address,
    policyId: graphTypes.BigInt,
    coverage: graphTypes.BigInt,
    fee: graphTypes.BigInt,
    duration: graphTypes.BigInt,
    standardRisk: graphTypes.BigInt,
    enteredEpochIndex: graphTypes.BigInt,
    SPS: graphTypes.BigInt,
    protocol: graphTypes.Address,
    epochMange: graphTypes.Address,
    eventAddress: graphTypes.Address,
): void {
    const bytes = ByteArray.fromUTF8(
        eventAddress.toHexString() + policyId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    let entity = Policy.load(str);
    if (entity == null) {
        // in this scenario, the id of the entity is the same as the id of the policy
        entity = new Policy(str);
    }
    entity.protocol = protocol.toHexString();
    entity.epochManage = epochMange.toHexString();
    entity.beneficiary = beneficiary.toHexString();
    entity.policyId = policyId;
    entity.coverage = coverage;
    entity.fee = fee;
    entity.duration = duration;
    entity.standardRisk = standardRisk;
    entity.enteredEpochIndex = enteredEpochIndex;
    entity.SPS = SPS;
    entity.isClaimed = false;
    entity.isClaimApplying = false;
    entity.isSettled = false;
    entity.save();
    return;
}
