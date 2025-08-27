const cron = require('node-cron');

class TestScheduler {
    constructor(taskFunction, intervalMs) {
        this.taskFunction = taskFunction;
        this.intervalMs = intervalMs;
        this.cronJob = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('Scheduler is already running.');
            return;
        }
        console.log(`Starting scheduler to run every ${this.intervalMs}ms.`);
        // For simplicity, we'll use setInterval for now, but node-cron can be used for more complex schedules.
        this.cronJob = setInterval(this.taskFunction, this.intervalMs);
        this.isRunning = true;
    }

    stop() {
        if (!this.isRunning) {
            console.log('Scheduler is not running.');
            return;
        }
        console.log('Stopping scheduler.');
        clearInterval(this.cronJob);
        this.isRunning = false;
        this.cronJob = null;
    }

    // Placeholder for cron-like functionality if needed later
    scheduleCron(cronExpression) {
        console.log(`Scheduling with cron expression: ${cronExpression}`);
        // this.cronJob = cron.schedule(cronExpression, this.taskFunction);
        // this.isRunning = true;
    }
}

module.exports = TestScheduler;
