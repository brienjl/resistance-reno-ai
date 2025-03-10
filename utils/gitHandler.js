import { execSync } from 'child_process'

const comitAndPushToGitHub = (filePath) => {
    try {
        console.log(`🔄 Staging file: ${filePath}`)
        execSync(`git add ${filePath}`)

        console.log(`📌 Committing changes... `)
        execSync(`git commit -m "Add EO Analysis: ${filePath}"`)

        console.log(`🚀 Pushing to Github...`)
        execSync(`git push orgin main`)

        console.log(`✅ Analysis committed and pushed to GitHub`)
        
    } catch (error) {
        console.error(`❌ Error pushing to GitHub `, error)
    }
}