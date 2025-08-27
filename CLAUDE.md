# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **CoinJar** project - a monorepo implementing a crypto payment solution for small merchants. The project demonstrates Account Abstraction (AA) using ERC-4337 with passkey authentication for simple crypto payments.

### Core Value Proposition
- Merchants can accept crypto payments by generating QR codes
- Customers pay using any standard wallet (MetaMask, etc.) on Optimism network
- Uses AirAccount SDK for account abstraction with passkey-based authentication
- Focus on small-amount payments for merchants like food stalls, small shops

## Architecture

This is a **pnpm monorepo** with three main packages:

### 1. `@aastar/sdk` (`packages/aastar-sdk/`)
**Core SDK for Account Abstraction functionality**
- **Purpose**: Provides AA account creation, passkey integration, and transaction management
- **Key Technologies**: TypeScript, @simplewebauthn/browser for passkey support
- **Main Entry**: `index.ts` exports `AAStarSDK` class
- **Build Output**: Compiles to `dist/` directory with declarations

**Key SDK Methods**:
- `registerWithPasskey(email)` - Creates AA account with passkey
- `loginWithPasskey(email)` - Authenticates with existing passkey
- `sendVerificationCode(email)` / `verifyCode(email, code)` - Email verification flow
- `getPrices()` / `getHistory()` - Fetch price data and transaction history

### 2. `coinjar-demo` (`packages/coinjar-demo/`)
**React frontend demo application**
- **Purpose**: Complete UI for merchant payment flows
- **Framework**: React + Vite
- **Key Features**: 
  - Email + passkey registration/login
  - QR code generation for receiving payments (using EIP-681 standard)
  - QR code scanner for making payments
  - Multi-currency support (USD, THB, CNY)
  - Transaction history

**UI Flow**:
1. Email verification → Passkey registration
2. Three modes: Receive (show QR), Pay (scan QR), History
3. Network selection (OP Sepolia/Mainnet)
4. Payment confirmation with passkey

### 3. `fake-backend` (`packages/fake-backend/`)
**Development backend server**
- **Purpose**: Mock API server for development and testing
- **Framework**: Express.js with CORS
- **Port**: 4000
- **Endpoints**: Registration, authentication, transactions, prices, history

## Development Commands

### Root Level (pnpm workspace)
```bash
# Install all dependencies
pnpm install

# Install in specific package
pnpm --filter @aastar/sdk install
pnpm --filter coinjar-demo install
pnpm --filter fake-backend install
```

### SDK Development (`packages/aastar-sdk/`)
```bash
cd packages/aastar-sdk
pnpm build          # Compile TypeScript to dist/
```

### Frontend Development (`packages/coinjar-demo/`)
```bash
cd packages/coinjar-demo
pnpm dev            # Start Vite dev server
pnpm build          # Build for production
pnpm preview        # Preview production build
pnpm lint           # Run ESLint
```

### Backend Development (`packages/fake-backend/`)
```bash
cd packages/fake-backend
pnpm start          # Start Express server on localhost:4000
```

### Complete Development Setup
1. **Start backend**: `cd packages/fake-backend && pnpm start`
2. **Build SDK**: `cd packages/aastar-sdk && pnpm build`
3. **Start frontend**: `cd packages/coinjar-demo && pnpm dev`

## Key Technical Patterns

### Account Abstraction Flow
1. **Registration**: Email verification → Passkey creation → AA account deployment
2. **Authentication**: Passkey challenge → Account recovery
3. **Transactions**: UserOp preparation → Passkey signing → Broadcast

### EIP-681 Standard Implementation
- QR codes use format: `ethereum:{address}@{chainId}`
- Example: `ethereum:0xe24b6f321B0140716a2b671ed0D983bb64E7DaFA@11155111`
- Enables automatic network switching in wallets

### State Management
- **Frontend**: React hooks for user state, login persistence via localStorage
- **SDK**: Handles passkey credential storage and retrieval
- **Backend**: Stateless API with fake data generation

### Error Handling
- SDK methods throw descriptive errors
- Frontend shows user-friendly error messages via alerts
- Backend returns structured error responses

## Important Context

### Target Networks
- **Primary**: Optimism (L2) for low fees
- **Development**: OP Sepolia testnet
- **Future**: SuperChain ecosystem support

### Security Model
- **Passkey-based**: No seed phrases, uses device biometrics
- **Account Abstraction**: Smart contract wallets with custom validation
- **Email verification**: Additional security layer for registration

### Product Positioning
- **Small merchants**: Food stalls, shops accepting small payments
- **Crypto tourism**: Travelers paying with crypto, merchants receiving in stable coins
- **Simplicity focus**: Minimal steps, clear UI, instant feedback

### Development Philosophy
- **Demo-first**: This is a working prototype demonstrating AirAccount SDK
- **Educational**: Shows complete AA implementation with real UX
- **Extensible**: Architecture supports adding features like multi-chain, advanced payments

## Workspace Dependencies

The project uses workspace dependencies (`workspace:*`) to link packages internally. The frontend imports the SDK as:
```javascript 
import { AAStarSDK } from '@aastar/sdk';
```

Always build the SDK before running the frontend in development.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
