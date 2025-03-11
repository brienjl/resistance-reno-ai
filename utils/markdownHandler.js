import fs from 'fs';

const getFilenameFromUrl = (url) => {
    const parsedUrl = new URL(url);
    let title = parsedUrl.pathname.split('/').filter(Boolean).pop(); // Extract last valid part of the path
    return title || "unknown-title"; // Default title if extraction fails
};

export const saveAnalysisToMarkdown = (url, date, analysis) => {
    const title = getFilenameFromUrl(url); // Extract EO title from URL

    // Sanitize filename
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_"); 

    // Format filename as "YYYY-MM-DD_title.md"
    const formattedFilename = `${date}_${sanitizedTitle}.md`;
    const filePath = `executive_order_analysis/${formattedFilename}`;

    // Ensure the directory exists
    if (!fs.existsSync("executive_order_analysis")) {
        fs.mkdirSync("executive_order_analysis");
    }

    // Construct the Markdown content
    const markdownContent = `# Executive Order Analysis: ${title}

📅 **Date:** ${date}  
🔗 **Original Executive Order:** [View on WhiteHouse.gov](${url})

---

${analysis}
`;

    // Write to file
    fs.writeFileSync(filePath, markdownContent);
    
    console.log(`✅ Analysis saved to ${filePath}`);
    return filePath;
};
