import { IAuthorizedRequestHandler } from '../types'
import { config } from '@/config/config';

async function sendRequest(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 100
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals
        const { messageId, reason, details } = req.body

        // Ensure the required fields are provided
        if (!messageId || !reason) {
            return res.status(400).json({
                success: false,
                error: 'Message ID and reason are required',
            })
        }

        // Get the reporting user
        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found',
            })
        }

        // Check if the message exists (using the chatMessage repository)
        const message = await repositories.chatMessage.get(messageId)
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found',
            })
        }

        // Prepare report data (excluding messageText for database insertion)
        const reportData = {
            reporterId: user._id,
            messageId,
            reason,
            details: `User details: ${details}`,
        }

        // Prepare data for GPT including the message text
        const gptData = {
            reason,
            details,
            messageText: message.text,
        }

        // Get GPT verdict
        const prompt = `Give verdict: ${JSON.stringify(gptData)}`
        const verdict = await sendRequest(prompt)
        reportData.details += `\nGPT Verdict: ${verdict}`

        // Create the report (without messageText)
        const report = await repositories.report.create(reportData)

        return res.json({ success: true, data: report })
    } catch (e) {
        next(e)
    }
}

export const get: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const { repositories } = res.locals

        // Retrieve the report by ID
        const report = await repositories.report.get(id)
        if (!report) {
            return res.status(404).json({
                success: false,
                error: 'Report not found',
            })
        }

        return res.json({ success: true, data: report })
    } catch (e) {
        next(e)
    }
}

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { page = 0, limit = 15 } = req.query
        const { repositories } = res.locals

        // List all reports with pagination
        const reports = await repositories.report.list({
            page: Number(page),
            limit: Number(limit),
        })

        return res.json({ success: true, data: reports })
    } catch (e) {
        next(e)
    }
}
