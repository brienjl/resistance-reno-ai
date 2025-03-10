import 'dotenv/config'
import OpenAI from 'openai'

export const openai = new OpenAI()

export const executiveOrderAnalysis = async (history, executiveOrderText) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [ ...history, {role: 'user', content: executiveOrderText }],
        model: 'gpt-4-turbo',
    })
    return chatCompletion.choices[0].message
}