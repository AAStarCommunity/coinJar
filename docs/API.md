# Fake Backend API Documentation

This document describes the API endpoints provided by the `fake-backend` service, primarily used for test orchestration and data collection.

**Base URL:** `http://localhost:4000`

---

## Test Orchestration Endpoints

These endpoints are used to control the automated transaction testing process.

### `POST /test/start`

Initiates the automated transaction test orchestration. The server will begin sending simulated transactions at predefined intervals.

- **Method:** `POST`
- **URL:** `/test/start`
- **Request Body:** None
- **Response:**
  - `200 OK`
  - **Content-Type:** `application/json`
  - **Body:**
    ```json
    {
      "message": "Test orchestration started."
    }
    ```

---

### `POST /test/stop`

Stops the ongoing automated transaction test orchestration.

- **Method:** `POST`
- **URL:** `/test/stop`
- **Request Body:** None
- **Response:**
  - `200 OK`
  - **Content-Type:** `application/json`
  - **Body:**
    ```json
    {
      "message": "Test orchestration stopped."
    }
    ```

---

### `GET /test/status`

Retrieves the current status of the test orchestration.

- **Method:** `GET`
- **URL:** `/test/status`
- **Request Body:** None
- **Response:**
  - `200 OK`
  - **Content-Type:** `application/json`
  - **Body:**
    ```json
    {
      "isRunning": true,          // boolean: true if test is running, false otherwise
      "transactionsSent": 50,     // number: count of transactions sent so far
      "totalTransactions": 150    // number: total transactions planned for the run
    }
    ```

---

### `GET /test/results`

Retrieves the collected test results. Results can be exported in JSON or CSV format.

- **Method:** `GET`
- **URL:** `/test/results`
- **Query Parameters:**
  - `format` (optional):
    - `json` (default): Returns results in JSON format.
    - `csv`: Returns results in CSV format.
- **Response (JSON format):**
  - `200 OK`
  - **Content-Type:** `application/json`
  - **Body:** An array of transaction record objects.
    ```json
    [
      {
        "Transaction_ID": 1,
        "Network": "Sepolia",
        "Type": "ERC20",
        "User_Type": "Alice",
        "Traditional_Steps": "",
        "SP_Steps": "2",
        "Traditional_Time": "",
        "SP_Time": "4.1",
        "Traditional_Cost": "",
        "SP_Cost": "0.17",
        "Success_Rate": 1,
        "Timestamp": "2024-01-15T10:00:00.000Z",
        "TX_Hash": "0x1234567890abcdef"
      },
      // ... more records
    ]
    ```
- **Response (CSV format):**
  - `200 OK`
  - **Content-Type:** `text/csv`
  - **Body:** A CSV string with headers.
    ```csv
    Transaction_ID,Network,Type,User_Type,Traditional_Steps,SP_Steps,Traditional_Time,SP_Time,Traditional_Cost,SP_Cost,Success_Rate,Timestamp,TX_Hash
    1,Sepolia,ERC20,Alice,,2,,4.1,,0.17,1,2024-01-15T10:00:00.000Z,0x1234567890abcdef
    2,Sepolia,ERC20,Bob,5,,20.5,,0.20,,1,2024-01-16T10:00:00.000Z,0xabcdef1234567890
    ```

---

## Other Endpoints (CoinJar Demo)

The backend also provides various endpoints for the CoinJar demo, including user registration, transaction preparation, email verification, price fetching, and transaction history. Refer to the `index.js` source code for full details.
