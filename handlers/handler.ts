import { LiquidityCertificate, Policy } from '../generated/schema';
import {
    NewLPMinted,
    Expired,
    Transfer,
} from '../generated/LiquidityCertificate/LiquidityCertificate';
import {
    NewPolicyMinted,
    PolicyClaimed,
    PolicySettled,
    PolicyUnderClaimApplying,
} from '../generated/Policy/Policy';
import * as graphTypes from '@graphprotocol/graph-ts';
import { BigInt, crypto, ByteArray } from '@graphprotocol/graph-ts';

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
        event.address,
    );
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
