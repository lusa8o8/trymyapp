import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export interface FeedbackData {
  app_name: string
  app_description: string
  app_category: string
  app_stage: string | null
  target_user: string | null
  specific_feedback_requested: string | null
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
  detailed_analysis: string | {
    overview: string
    ux_analysis: string
    bug_analysis: string
    suggestions_analysis: string
    action_items: string
  }
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

  const prompt = `You are a product analyst specialising in 
${data.app_category} products.

App: ${data.app_name}
Description: ${data.app_description}
Category: ${data.app_category}
Stage: ${data.app_stage ?? 'Not specified'}
Target user: ${data.target_user ?? 'Not specified'}
Specific feedback requested: ${data.specific_feedback_requested ?? 'General feedback'}

Testing Summary:
- Total testers: ${data.total_testers}
- Completed tests: ${data.completed_tests}
- Completion rate: ${Math.round((data.completed_tests / Math.max(data.total_testers, 1)) * 100)}%

Evaluate ALL feedback through the lens of this specific 
category, target user, and the developer's specific questions.
A UX issue for a Finance app (trust signals, clarity, compliance)
is different from one for a Productivity tool (speed, friction)
or a Social app (engagement, onboarding). Reference the target
user and category explicitly in your analysis.
Address the developer's specific feedback request directly
in your priority actions.

Individual Feedback:
${feedbackText}

Respond with ONLY a valid JSON object (no markdown, no backticks,
no preamble) with this exact structure:
{
  "summary": "2-3 sentence executive summary referencing the app category and target user",
  "ux_score_avg": <number between 1-5>,
  "sentiment": "<positive|neutral|negative>",
  "top_issues": [
    {"issue": "description", "frequency": <number>, "severity": "<high|medium|low>"}
  ],
  "bugs": [
    {"description": "bug description", "frequency": <number>}
  ],
  "suggestions": [
    {"suggestion": "suggestion text", "votes": <number>}
  ],
  "would_use_pct": <integer 0-100>,
  "priority_actions": [
    "Action addressing developer's specific question first",
    "action 2",
    "action 3"
  ],
  "detailed_analysis": {
    "overview": "Overall assessment referencing ${data.app_category} category context",
    "ux_analysis": "UX findings evaluated against ${data.target_user ?? 'target user'} expectations",
    "bug_analysis": "Technical issues found during testing",
    "suggestions_analysis": "Synthesis of tester suggestions in context of product stage",
    "action_items": "Specific prioritised next steps addressing: ${data.specific_feedback_requested ?? 'overall improvement'}"
  }
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
