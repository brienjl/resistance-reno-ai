import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const EXEC_ORDERS_URL = 'https://www.whitehouse.gov/presidential-actions/executive-orders/';
const JSON_FILE = path.resolve('executive_orders.json');

// Get today's date in YYYY-MM-DD format and PST timezone
const getToday = () => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
};

export const fetchTodaysExecutiveOrders = async () => {
    const today = getToday();
    //const today = '2025-04-23'
    const output = [];

    try {
        console.log(`🔎 Fetching executive orders from: ${EXEC_ORDERS_URL}`);
        const { data } = await axios.get(EXEC_ORDERS_URL);
        const $ = cheerio.load(data);

        $('li').each((_, el) => {
            const timeTag = $(el).find('time');
            const date = timeTag.attr('datetime')?.split('T')[0];
            const title = $(el).find('h2').text().trim();
            const relativeUrl = $(el).find('a').attr('href');
            const url = relativeUrl ? `${relativeUrl}` : null;

            if (date === today && url) {
                output.push({ title, url });
            }
        });

        if (output.length === 0) {
            console.warn(`⚠️ No executive orders found on the WhiteHouse website: (${today}).`);
            return;
        }

        // Load or initialize the JSON file
        let existingData = {};
        if (fs.existsSync(JSON_FILE)) {
            const raw = fs.readFileSync(JSON_FILE);
            existingData = JSON.parse(raw);
        }

        // Prevent duplicates
        const urlsToday = new Set(existingData[today]?.map(entry => entry.url) || []);
        const newEntries = output.filter(entry => !urlsToday.has(entry.url));

        if (newEntries.length === 0) {
            console.warn(`📭 No new executive orders to add to json file.`);
            return;
        }

        // Append today's entries
        existingData[today] = [...(existingData[today] || []), ...newEntries];
        fs.writeFileSync(JSON_FILE, JSON.stringify(existingData, null, 2));

        console.log(`✅ Added ${newEntries.length} executive order(s) to ${JSON_FILE}`);

    } catch (error) {
        console.error(`❌ Error during scraping:`, error.message);
    }
};


//fetchTodaysExecutiveOrders();