import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchExecutiveOrderText = async (url) => {
    try {
        console.log(`🔎 Fetching Executive Order from: ${url}`);
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let paragraphs = [];

        // Extract EO text
        $('p').each((_, element) => {
            paragraphs.push($(element).text().trim());
        });

        // Extract date from <time> tag
        const timeElement = $('time').attr('datetime'); // "2025-03-07T21:31:36-05:00"
        const date = timeElement ? timeElement.split('T')[0] : 'unknown-date';

        const fullText = paragraphs.join('\n\n');
        return { text: fullText, date };
    } catch (error) {
        console.error('❌ Error fetching executive order:', error);
        return { text: null, date: 'unknown-date' };
    }
};