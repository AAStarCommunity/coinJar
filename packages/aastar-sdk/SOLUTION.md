# AirAccount SDK Technical Solution

## 1. Goal

The goal is to develop the `AirAccount` SDK, an ERC-4337 compliant abstract account SDK that supports EIP-7702 and social recovery.

## 2. Core Components

-   **`AirAccount.ts`:** Represents the user's smart account. It uses `simple-account` from `eth-infinitism` as a base.
-   **`AirAccountClient.ts`:** The main client for interacting with the `AirAccount`. It sends user operations to a bundler.
-   **`AirAccountSigner.ts`:** A helper class to create and manage signers.

## 3. Phased Development Plan

### Phase 1: Simple Transaction (User Pays Gas)

-   Implement the basic `AirAccount` contract using `simple-account`.
-   Implement the `AirAccountSigner` and `AirAccountClient`.
-   Implement the `sendUserOperation` method to send a simple transaction where the user pays for gas.
-   Write tests for this basic flow.

### Phase 2: Gas Sponsorship (Paymaster)

-   Implement a simple paymaster contract.
-   Update the `AirAccountClient` to interact with the paymaster.
-   Update the `sendUserOperation` method to support gasless transactions.
-   Write tests for the paymaster integration.

### Phase 3: Social Recovery and EIP-7702

-   Implement social recovery features in the `AirAccount` contract.
-   Implement support for EIP-7702.
-   Add methods to the `AirAccountClient` to manage social recovery and EIP-7702 features.
-   Write tests for these features.

## 4. API Design

The SDK will follow a direct API style, similar to ZeroDev's `kernelClient.sendUserOperation`.

## 5. RPC Provider

The `AirAccountClient` will be initialized with an all-in-one RPC URL that includes a bundler and a paymaster.
