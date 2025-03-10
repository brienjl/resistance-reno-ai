import { executiveOrderAnalysis } from './models/openai.js';
import { fetchExecutiveOrderText, getPathFromUrl } from './models/scraper.js';
import { saveAnalysisToMarkdown } from './utils/markdownHandler.js';

const history = [
   {
      role: 'system',
      content: `
You are a legal and policy analyst specializing in U.S. executive orders.
Your task is to analyze a given executive order and provide a structured evaluation based on the following framework:

1️⃣ **Summary & Intent**  
   - Briefly summarize the executive order’s purpose and key provisions.

2️⃣ **Fact-Checking**  
   - Identify key claims made in the executive order.
   - Determine whether they are **true, mostly true, partly true, misleading, or false** using known facts.
   
3️⃣ **Constitutionality Check**  
   - Assess whether this executive order aligns with **constitutional principles** and **legal precedent**.
   - Identify potential **legal challenges** or **conflicts with existing laws**.

4️⃣ **Harm Assessment**  
   - Evaluate the **potential risks** or **negative consequences**:
     - 🔹 **Direct Harm** (e.g., impact on individuals' rights)
     - 🔹 **Legal Harm** (e.g., undermining democracy or due process)
     - 🔹 **Economic Harm** (e.g., negative financial impact)
     - 🔹 **Environmental Harm** (e.g., climate impact)
     - 🔹 **Global Stability** (e.g., foreign policy risks)

5️⃣ **Final Scoring (-5 to +5 in each category)**  
   - **Fact-Checking Score** (-5 = False, +5 = True)  
   - **Constitutionality Score** (-5 = Unconstitutional, +5 = Legally Sound)  
   - **Harm Score** (-5 = Harmful, +5 = Beneficial)  

🔎 **Final Verdict:**  
Summarize the key takeaways and whether the order is likely to be **beneficial, legally sound, or controversial.**  

Now, analyze the following executive order:
`
   },
]
const EXECUTIVE_ORDER_URL = 'https://www.whitehouse.gov/presidential-actions/2025/03/restoring-public-service-loan-forgiveness/';

const start = async () => {
   const executiveOrderText = await fetchExecutiveOrderText(EXECUTIVE_ORDER_URL);
   
   if (!executiveOrderText) {
      console.log('❌ Failed to retrieve executive order text.');
      return;
   }

   console.log('✅ Executive order text retrieved. Sending to OpenAI for analysis...');

   const response = await executiveOrderAnalysis(history,executiveOrderText)

   const eoTitle = getPathFromUrl(EXECUTIVE_ORDER_URL)
   const filePath = saveAnalysisToMarkdown(eoTitle, response.content)
   comitAndPushToGitHub(filePath)

}

start();