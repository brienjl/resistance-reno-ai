import axios  from 'axios';
import * as cheerio from 'cheerio';


export const fetchExecutiveOrderText = async (url) => {
    try {
        console.log(`Fetcing EO from ${url}`);
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let paragraphs = [];

        $('p').each((_, element) => {
            paragraphs.push($(element).text().trim());
        });

        const fullText = paragraphs.join('\n\n');
        return fullText || null;
    } catch (error) {
        console.error('Error fetching executive order ', error);
        return null;
    }
};