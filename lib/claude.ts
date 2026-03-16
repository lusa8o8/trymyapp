import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export interface FeedbackData {
  app_name: string
  app_description: string
  total_testers: number
  completed_tests: number
  feedbacks: Array<{
    ux_rating: number | null
    ux_feedback: string | null
    bug_report: string | null
    suggestions: string | null
    would_use: boolean | null
    checklist_done: boolean
  }>
}

export interface ReportContent {
  summary: string
  ux_score_avg: number
  sentiment: 'positive' | 'neutral' | 'negative'
  top_issues: Array<{
    issue: string
    frequency: number
    severity: 'high' | 'medium' | 'low'
  }>
  bugs: Array<{
    description: string
    frequency: number
  }>
  suggestions: Array<{
    suggestion: string
    votes: number
  }>
  would_use_pct: number
  priority_actions: string[]
  detailed_analysis: string
}

export async function generateReport(data: FeedbackData): Promise<ReportContent> {
  const feedbackText = data.feedbacks.map((f, i) => `
Tester ${i + 1}:
- UX Rating: ${f.ux_rating ?? 'Not rated'}/5
- UX Feedback: ${f.ux_feedback || 'None provided'}
- Bugs Found: ${f.bug_report || 'None reported'}
- Suggestions: ${f.suggestions || 'None provided'}
- Would Use Again: ${f.would_use === null ? 'Not answered' : f.would_use ? 'Yes' : 'No'}
- Completed Checklist: ${f.checklist_done ? 'Yes' : 'No'}
`).join('\n---\n')

  const prompt = `You are an expert product analyst reviewing MVP test feedback for "${data.app_name}".

App Description: ${data.app_description}

Testing Summary:
- Total testers: ${data.total_testers}
- Completed tests: ${data.completed_tests}
- Completion rate: ${Math.round((data.completed_tests / Math.max(data.total_testers, 1)) * 100)}%

Individual Feedback:
${feedbackText}

Analyze this feedback and respond with ONLY a valid JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "summary": "2-3 sentence executive summary of the overall testing results",
  "ux_score_avg": <number between 1-5, average of all UX ratings>,
  "sentiment": "<positive|neutral|negative based on overall feedback>",
  "top_issues": [
    {"issue": "description of issue", "frequency": <number of testers who mentioned it>, "severity": "<high|medium|low>"}
  ],
  "bugs": [
    {"description": "bug description", "frequency": <number>}
  ],
  "suggestions": [
    {"suggestion": "suggestion text", "votes": <number of testers who mentioned it>}
  ],
  "would_use_pct": <percentage as integer 0-100>,
  "priority_actions": ["action 1", "action 2", "action 3"],
  "detailed_analysis": "3-4 paragraph detailed analysis covering UX, bugs, suggestions, and recommendations"
}`

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })

  const responseText = message.content
    .filter(block => block.type === 'text')
    .map(block => (block as { type: 'text'; text: string }).text)
    .join('')

  const clean = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  return JSON.parse(clean) as ReportContent
}
