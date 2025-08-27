# Transaction Testing System

This project provides a comprehensive system for testing and orchestrating blockchain transactions, focusing on Account Abstraction (AA) and Paymaster functionalities. It includes a backend API for test control and metrics collection, and a frontend for visualization and interaction.

## Features

- Automated transaction orchestration (150 transactions/day).
- Support for ERC20 transfers, NFT minting, and DApp interactions.
- Integration with SuperPaymaster for gas sponsorship.
- Multi-network support (Sepolia, OP Sepolia, OP Mainnet).
- Real-time metrics collection and CSV/JSON export.
- Test account management (Alice, Bob, Charlie personas).

## Project Structure

- `packages/aastar-sdk`: The core SDK for interacting with AA accounts and Paymasters.
- `packages/fake-backend`: The backend API for test orchestration and metrics collection.
- `packages/transaction-test-demo`: The React frontend for controlling tests and viewing results.

## Setup

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (package manager)
- Access to a bundler and paymaster service (e.g., Pimlico, AAStar Paymaster).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository_url]
    cd [repository_name]
    ```
2.  **Install root dependencies:**
    ```bash
    pnpm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `projects/start/packages/fake-backend/` directory with the following:
    ```
    BUNDLER_URL=YOUR_PIMLICO_BUNDLER_URL
    PAYMASTER_URL=YOUR_AASTAR_PAYMASTER_URL
    PAYMASTER_API_KEY=YOUR_AASTAR_PAYMASTER_API_KEY
    ```
    *Replace placeholders with actual URLs and API keys.*

## Running the System

### 1. Start the Backend

Navigate to the `fake-backend` directory and start the server:

```bash
cd projects/start/packages/fake-backend
pnpm start
```

The backend will listen on `http://localhost:4000`.

### 2. Start the Frontend

Navigate to the `transaction-test-demo` directory and start the development server:

```bash
cd projects/start/packages/transaction-test-demo
pnpm dev
```

The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is taken).

## API Endpoints (Fake Backend)

- `POST /test/start`: Start the test orchestration.
- `POST /test/stop`: Stop the test orchestration.
- `GET /test/status`: Get the current test status (running, transactions sent).
- `GET /test/results`: Get test results in JSON format.
- `GET /test/results?format=csv`: Get test results in CSV format.

## Troubleshooting

- **`ERR_MODULE_NOT_FOUND`**: Ensure all `pnpm install` commands have been run in the root and in relevant package directories. If issues persist, check `package.json` files for correct dependencies and rebuild the `@aastar/sdk` if necessary.
- **`Cannot GET /test/status` (or other /test routes)**: Ensure the `fake-backend` server is running the latest code. You might need to kill the old process and restart it.

## Future Work

- Implement more robust error handling and retry mechanisms.
- Add more sophisticated gas estimation and transaction validation.
- Integrate with real testnet faucets for funding test accounts.
- Implement a proper database for persistent storage of test results.
