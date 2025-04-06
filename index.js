import { executiveOrderAnalysis, history } from './models/openai.js';
import { fetchExecutiveOrderText } from './models/getExecutiveOrder.js';
import { commitAndPushToGitHub } from './utils/gitHandler.js';
import { saveAnalysisToMarkdown } from './utils/markdownHandler.js';


const start = async (url) => {

    // 1️⃣ Fetch Executive Order Text and Date
    const EXECUTIVE_ORDER_URL = url
    const { text: executiveOrderText, date } = await fetchExecutiveOrderText(EXECUTIVE_ORDER_URL);

    if (!executiveOrderText) {
        console.log('❌ Failed to retrieve executive order text.');
        return;
    }

    console.log(`✅ Executive order text retrieved. Sending to OpenAI for analysis...`);

    // 2️⃣ Analyze with OpenAI
    const response = await executiveOrderAnalysis(history, executiveOrderText);

    // 3️⃣ Save analysis with original EO URL and date
    const filePath = saveAnalysisToMarkdown(EXECUTIVE_ORDER_URL, date, response.content);

    // 4️⃣ Commit & push to GitHub
    commitAndPushToGitHub(filePath);
};

// Run the script
start('https://www.whitehouse.gov/presidential-actions/2025/03/designating-english-as-the-official-language-of-the-united-states/');