import fs from 'fs';
import path from 'path';
import { executiveOrderAnalysis, history } from './models/openai.js';
import { fetchExecutiveOrderText } from './models/getExecutiveOrder.js';
import { fetchTodaysExecutiveOrders } from './models/getListOfExecutiveOrders.js';
import { commitAndPushToGitHub } from './utils/gitHandler.js';
import { saveAnalysisToMarkdown } from './utils/markdownHandler.js';

// Location of the master JSON file that stores EO metadata
const JSON_FILE = path.resolve('executive_orders.json');

// Get today's date in YYYY-MM-DD format and PST timezone
const getToday = () => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
};

/**
 * 🔎 Process a single executive order:
 * - Fetch the EO text and date from the White House site
 * - Analyze the EO using OpenAI
 * - Save the analysis to a local Markdown file
 * - Commit and push the file to GitHub
 */
const processExecutiveOrder = async (url) => {
    console.log(`🔎 Starting analysis for: ${url}`);

    const { text: executiveOrderText, date } = await fetchExecutiveOrderText(url);

    if (!executiveOrderText) {
        console.log('❌ Failed to retrieve executive order text.');
        return;
    }

    console.log(`✅ Executive order text retrieved. Sending to OpenAI for analysis...`);
    const response = await executiveOrderAnalysis(history, executiveOrderText);
    const filePath = saveAnalysisToMarkdown(url, date, response.content);
    commitAndPushToGitHub(filePath);
};

/**
 * 📦 Loop through all executive orders listed for today and process any unprocessed ones
 * - Skips EOs already marked as processed
 * - Updates the master JSON file with `"processed": true` for each successful EO
 */
const processTodaysExecutiveOrders = async () => {
    const today = getToday();
    //const today = '2025-04-23'

    // Make sure the executive_orders.json file exists
    if (!fs.existsSync(JSON_FILE)) {
        console.error(`❌ ${JSON_FILE} not found. Something went wrong with scraping.`);
        return;
    }

    // Load existing EO data
    const raw = fs.readFileSync(JSON_FILE);
    const data = JSON.parse(raw);
    const todaysOrders = data[today];

    if (!todaysOrders || todaysOrders.length === 0) {
        console.log(`📭 No executive orders to analyze today ${today}.`);
        return;
    }

    console.log(`📦 Processing ${todaysOrders.length} executive order(s) from ${today}...`);

    let updated = false;

    // Loop through each EO for today
    for (const eo of todaysOrders) {
        // Skip if already processed
        if (eo.processed) {
            console.log(`⏩ Skipping already processed: ${eo.title}`);
            continue;
        }

        try {
            // Run full analysis pipeline
            await processExecutiveOrder(eo.url);
            eo.processed = true; // Mark as processed
            updated = true;
        } catch (err) {
            console.error(`❌ Failed to process EO: ${eo.title}\n`, err.message);
        }
    }

    // Write updates back to the JSON file only if changes were made
    if (updated) {
        fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
        console.log(`📝 Updated ${JSON_FILE} with processed status.`);
    }

    console.log(`✅ Finished processing all executive orders for ${today}.`);
};

/**
 * 🚀 Orchestrator function to run the full pipeline:
 * - Step 1: Scrape the White House EO page and update executive_orders.json
 * - Step 2: Process all new EOs listed for today
 */
const run = async () => {
    await fetchTodaysExecutiveOrders();      // 🔄 Scrape and update JSON with today's EOs
    await processTodaysExecutiveOrders();    // ⚙️ Analyze and commit any new/unprocessed ones
};

// Run the whole pipeline
run();


// processExecutiveOrder('url here') //will take in a url and you can run that EO individually if there's errors