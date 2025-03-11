import fs from 'fs';
import path from 'path';

const getPathFromUrl = (url) => {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.replace('/presidential-actions/', '').replace(/\/$/, '');
};

export const saveAnalysisToMarkdown = (url, analysis) => {
    const title = getPathFromUrl(url); // Extract EO title from URL
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9/_-]/g, "_"); // Sanitize filename
    const filePath = `executive_order_analysis/${sanitizedTitle}.md`;

    // Ensure the full directory path exists
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: false }); // Create parent directories
    }

    // Construct the Markdown content
    const markdownContent = `# Executive Order Analysis: ${title}

🔗 **Original Executive Order:** [View on WhiteHouse.gov](${url})

---

${analysis}
`;

    // Write to file
    fs.writeFileSync(filePath, markdownContent);
    
    console.log(`✅ Analysis saved to ${filePath}`);
    return filePath;
};

