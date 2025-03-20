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

---

## ✍️ Contact A Nevada Representative

### Senator Catherine Cortez Masto (D)
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://www.cortezmasto.senate.gov/contact/connect/) | |
| Reno Office Number      | 775-686-5750 |
| Las Vegas Office Number | 702-388-5030 |
| D.C Number              | 202-224-7327 |

### Senator Jacky Rosen (D)
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://www.rosen.senate.gov/email-jacky/) | |
| Reno Office Number      | 775-337-0110 |
| Las Vegas Office Number | 702-388-0205 |
| D.C Number              | 202-224-6244 |

### Congresswoman Dina Titus (D) - NV District 1
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://titus.house.gov/contact/) | |
| Las Vegas Office Number | 702-220-9823 |
| D.C Number              | 202-225-5965 |

### Congressman Mark Amodei (R) - NV District 2
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://amodei.house.gov/address_authentication?form=/email-me) | |
| Reno Office Number      | 775-686-5760 |
| Elko Office Number      | 775-777-7705 |
| D.C Number              | 202-225-6155 |

### Congresswoman Susie Lee (D) - NV District 3
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://susielee.house.gov/address_authentication?form=/contact) | |
| Las Vegas Office Number | 702-963-9336 |
| D.C Number              | 202-225-3252 |

### Congressman Steven Horsford (D) - NV District 4
|                         |              |
| ---                     | ---          |
|[Online Contact Page](https://horsford.house.gov/address_authentication?form=/contact) | |
| Las Vegas Office Number | 702-963-9360 |
| D.C Number              | 202-225-9894 |

`;

    // Write to file
    fs.writeFileSync(filePath, markdownContent);
    
    console.log(`✅ Analysis saved to ${filePath}`);
    return filePath;
};
