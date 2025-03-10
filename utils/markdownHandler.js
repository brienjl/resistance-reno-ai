import fs from 'fs'

export const saveAnalysisToMarkdown = (title, analysis) => {

    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_")
    const filePath = `EO-analysis/${sanitizedTitle}.md`

    if (!fs.existsSync('EO-analysis')) {
        fs.mkdirSync('EO-analysis')
    }

    const markdownContent = `# ${title}\n\n${analysis}`
    fs.writeFileSync(filePath, markdownContent)

    console.log(`✅ Analysis Saved to ${filePath}`)
    return filePath;
}