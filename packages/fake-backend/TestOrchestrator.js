// const { AAStarClient, TestAccountManager, TransactionTypeHandler } = require('@aastar/sdk');
const MetricsCollector = require("./MetricsCollector");
const TestScheduler = require("./TestScheduler");
// const { NetworkManager } = require('@aastar/sdk/dist/network/NetworkManager'); // Import NetworkManager

class TestOrchestrator {
  constructor() {
    this.isRunning = false;
    this.metricsCollector = new MetricsCollector();
    this.transactionsSent = 0;
    this.totalTransactions = 150;
    const runDuration = 24 * 60 * 60 * 1000; // 24 hours in ms
    const interval = runDuration / this.totalTransactions;

    this.scheduler = new TestScheduler(() => this.runTransaction(), interval);

    // Use a default network name for client initialization
    const defaultNetworkName = "sepolia";
    const clientConfig = {
      networkName: defaultNetworkName,
    };
    this.client = new AAStarClient(clientConfig);
    this.testAccountManager = new TestAccountManager(this.client);
  }

  async start() {
    if (this.isRunning) {
      console.log("Test is already running.");
      return;
    }

    console.log("Starting test orchestration...");
    this.isRunning = true;
    this.metricsCollector.clear();
    this.transactionsSent = 0;

    await this.testAccountManager.createAliceAccount();
    await this.testAccountManager.createBobAccount();
    await this.testAccountManager.createCharlieAccount();
    await this.client.authPaymaster(
      process.env.PAYMASTER_API_KEY || "YOUR_API_KEY",
    );

    this.scheduler.start();
    console.log(
      `Test started. Will send ${this.totalTransactions} transactions over 24 hours.`,
    );
  }

  stop() {
    if (!this.isRunning) {
      console.log("Test is not running.");
      return;
    }
    console.log("Stopping test orchestration...");
    this.scheduler.stop();
    this.isRunning = false;
  }

  getStatus() {
    return {
      isRunning: this.scheduler.isRunning,
      transactionsSent: this.transactionsSent,
      totalTransactions: this.totalTransactions,
    };
  }

  getResults(format = "json") {
    if (format.toLowerCase() === "csv") {
      return this.metricsCollector.getResultsAsCSV();
    }
    return this.metricsCollector.getResultsAsJSON();
  }

  async runTransaction() {
    if (
      !this.scheduler.isRunning ||
      this.transactionsSent >= this.totalTransactions
    ) {
      this.stop();
      return;
    }

    const startTime = Date.now();
    let txHash = "N/A";
    let status = "FAILED"; // Default to FAILED
    let error = null;

    const users = ["Alice", "Bob", "Charlie"];
    const txTypes = ["ERC20", "NFT", "DApp"];
    // const availableNetworks = NetworkManager.getAllNetworkNames(); // Get all network names
    const availableNetworks = ["sepolia"]; // Hardcode to sepolia
    const selectedNetwork =
      availableNetworks[Math.floor(Math.random() * availableNetworks.length)]; // Randomly select a network

    const userType = users[Math.floor(Math.random() * users.length)];
    const txTypeSelected = txTypes[Math.floor(Math.random() * txTypes.length)];
    const user = this.testAccountManager.getAccount(userType);
    const handler = new TransactionTypeHandler(this.client, user.account);
    const isSponsored = user.name === "Bob";

    console.log(
      `Running tx #${this.transactionsSent + 1}: User=${userType}, Type=${txTypeSelected}, Sponsored=${isSponsored}, Network=${selectedNetwork}`,
    );

    try {
      // Re-initialize client with selected network for this transaction
      // This is important because the client's network config is immutable after creation
      const transactionClient = new AAStarClient({
        networkName: selectedNetwork,
      });
      const transactionHandler = new TransactionTypeHandler(
        transactionClient,
        user.account,
      );

      let txPromise;
      if (txTypeSelected === "ERC20") {
        txPromise = transactionHandler.executeERC20Transfer(
          "0xYourERC20TokenAddress",
          "0xRecipientAddress",
          1n,
          { withPaymaster: isSponsored },
        );
      } else if (txTypeSelected === "NFT") {
        txPromise = transactionHandler.executeNFTMint(
          "0xYourNFTAddress",
          await user.account.getAccountAddress(),
          { withPaymaster: isSponsored },
        );
      } else {
        // DApp
        txPromise = transactionHandler.executeDAppInteraction(
          "0xYourDAppAddress",
          "0x12345678",
          { withPaymaster: isSponsored },
        );
      }
      txHash = await txPromise;
      status = "SUCCESS";
    } catch (e) {
      status = "FAILED";
      error = e.message;
      console.error(
        `Transaction failed for ${userType} on ${selectedNetwork}:`,
        e,
      );
    }

    const endTime = Date.now();
    this.metricsCollector.addRecord({
      txId: this.transactionsSent + 1,
      network: selectedNetwork,
      type: txTypeSelected,
      user: userType,
      isSponsored: isSponsored,
      steps: isSponsored ? 2 : 5, // Mock steps
      time: (endTime - startTime) / 1000, // Duration in seconds
      cost: parseFloat((Math.random() * 0.1).toFixed(3)), // Mock cost
      txHash: txHash,
      status: status,
      error: error,
    });
    this.transactionsSent++;
  }
}

module.exports = TestOrchestrator;
