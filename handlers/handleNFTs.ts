import { LiquidityCertificate, Market, Policy } from '../generated/schema';

import { BigInt, crypto, ByteArray } from '@graphprotocol/graph-ts';
import {
    Expired,
    NewLPMinted,
    Transfer,
} from '../generated/templates/LiquidityCertificate/LiquidityCertificate';
import {
    NewPolicyMinted,
    PolicyClaimed,
    PolicySettled,
    PolicyUnderClaimApplying,
} from '../generated/templates/Policy/Policy';

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
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.certificateId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = LiquidityCertificate.load(str);
    if (entity == null) {
        const newEntity = new LiquidityCertificate(str);
        newEntity.protocol = event.params.protocol.toHexString();
        newEntity.owner = event.params.owner.toHexString();
        newEntity.certificateId = event.params.certificateId;
        newEntity.enteredEpochIndex = event.params.enteredEpochIndex;
        newEntity.exitedEpochIndex = BigInt.zero();
        newEntity.rewardDebtEpochIndex = event.params.enteredEpochIndex;
        newEntity.liquidity = event.params.liquidity;
        newEntity.SPSLocked = BigInt.zero();
        newEntity.isValid = true;
        newEntity.save();
    }
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
    const bytes = ByteArray.fromUTF8(
        event.address.toHexString() + event.params.policyId.toString(),
    );
    const str = crypto.keccak256(bytes).toHexString();
    const entity = Policy.load(str);
    if (entity == null) {
        const newEntity = new Policy(str);
        newEntity.epochManage = event.params.epochManage.toHexString();
        newEntity.protocol = event.params.protocol.toHexString();
        newEntity.beneficiary = event.params.beneficiary.toHexString();
        newEntity.policyId = event.params.policyId;
        newEntity.timestamp = event.params.timestamp;
        newEntity.coverage = event.params.coverage;
        newEntity.fee = event.params.fee;
        newEntity.duration = event.params.duration;
        newEntity.standardRisk = event.params.standardRisk;
        newEntity.enteredEpochIndex = event.params.enteredEpochIndex;
        newEntity.SPS = event.params.SPS;
        newEntity.isClaimed = false;
        newEntity.isClaimApplying = false;
        newEntity.isSettled = false;
        newEntity.save();
    }
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
