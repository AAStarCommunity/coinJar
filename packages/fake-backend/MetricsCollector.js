const os = require('os');

class MetricsCollector {
    constructor() {
        this.records = [];
        this.header = 'Transaction_ID,Network,Type,User_Type,Traditional_Steps,SP_Steps,Traditional_Time,SP_Time,Traditional_Cost,SP_Cost,Success_Rate,Timestamp,TX_Hash';
    }

    /**
     * Adds a new record for a completed transaction.
     * @param {object} data - The data for the transaction.
     * @param {number} data.txId - Unique transaction ID.
     * @param {string} data.network - Network name (e.g., Sepolia).
     * @param {string} data.type - Transaction type (e.g., ERC20, NFT, DApp).
     * @param {string} data.user - User type (e.g., Alice, Bob, Charlie).
     * @param {number} data.steps - Number of steps.
     * @param {number} data.time - Execution time in seconds.
     * @param {number} data.cost - Transaction cost.
     * @param {string} data.txHash - Transaction hash.
     * @param {boolean} data.isSponsored - True if sponsored, false otherwise.
     * @param {string} data.status - 'SUCCESS' or 'FAILED'.
     */
    addRecord(data) {
        const record = {
            Transaction_ID: data.txId,
            Network: data.network,
            Type: data.type,
            User_Type: data.user,
            Traditional_Steps: !data.isSponsored ? data.steps : '',
            SP_Steps: data.isSponsored ? data.steps : '',
            Traditional_Time: !data.isSponsored ? data.time : '',
            SP_Time: data.isSponsored ? data.time : '',
            Traditional_Cost: !data.isSponsored ? data.cost : '',
            SP_Cost: data.isSponsored ? data.cost : '',
            Success_Rate: data.status === 'SUCCESS' ? 1 : 0,
            Timestamp: new Date().toISOString(),
            TX_Hash: data.txHash,
        };
        this.records.push(record);
    }

    /**
     * Returns all records in CSV format.
     * @returns {string} The records as a CSV string.
     */
    getResultsAsCSV() {
        if (this.records.length === 0) {
            return this.header;
        }

        const csvRows = [this.header];
        this.records.forEach(record => {
            const values = Object.values(record).map(value => {
                // Handle values that might contain commas or newlines
                if (typeof value === 'string' && (value.includes(',') || value.includes(os.EOL))) {
                    return `"${value.replace(/"/g, '""')}"`; // Escape double quotes and wrap in quotes
                }
                return value;
            }).join(',');
            csvRows.push(values);
        });

        return csvRows.join(os.EOL);
    }

    /**
     * Returns all records as a JSON object.
     * @returns {object[]} The records as an array of objects.
     */
    getResultsAsJSON() {
        return this.records;
    }

    /**
     * Filters records based on provided criteria.
     * @param {object} criteria - An object with properties to filter by (e.g., { user: 'Alice', type: 'ERC20' }).
     * @returns {object[]} Filtered records.
     */
    filterRecords(criteria) {
        return this.records.filter(record => {
            for (const key in criteria) {
                if (record[key] !== criteria[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Calculates basic statistics for the collected metrics.
     * @param {object[]} [records=this.records] - Records to analyze. Defaults to all records.
     * @returns {object} Statistical summary.
     */
    getStatistics(records = this.records) {
        if (records.length === 0) {
            return {
                totalTransactions: 0,
                successfulTransactions: 0,
                successRate: 0,
                avgTraditionalTime: 0,
                avgSPTime: 0,
                avgTraditionalCost: 0,
                avgSPCost: 0,
            };
        }

        const totalTransactions = records.length;
        const successfulTransactions = records.filter(r => r.Success_Rate === 1).length;
        const successRate = successfulTransactions / totalTransactions;

        const traditionalTimes = records.filter(r => r.Traditional_Time !== '').map(r => parseFloat(r.Traditional_Time));
        const spTimes = records.filter(r => r.SP_Time !== '').map(r => parseFloat(r.SP_Time));
        const traditionalCosts = records.filter(r => r.Traditional_Cost !== '').map(r => parseFloat(r.Traditional_Cost));
        const spCosts = records.filter(r => r.SP_Cost !== '').map(r => parseFloat(r.SP_Cost));

        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        const average = (arr) => arr.length > 0 ? sum(arr) / arr.length : 0;

        return {
            totalTransactions,
            successfulTransactions,
            successRate: parseFloat(successRate.toFixed(2)),
            avgTraditionalTime: parseFloat(average(traditionalTimes).toFixed(3)),
            avgSPTime: parseFloat(average(spTimes).toFixed(3)),
            avgTraditionalCost: parseFloat(average(traditionalCosts).toFixed(3)),
            avgSPCost: parseFloat(average(spCosts).toFixed(3)),
        };
    }

    /**
     * Clears all recorded data.
     */
    clear() {
        this.records = [];
    }
}

module.exports = MetricsCollector;