class AIHelpService {
  getHelpResponse() {
    return {
      content: `🤖 ProposalForge AI Assistant

I can help with:

📁 Projects

• Show project details
• Project cost
• Project technologies
• Project timelines
• Client projects
• Project scope

--------------------------------

📄 Proposals

• Proposal information
• Proposal summaries

--------------------------------

📊 Analytics

• Project statistics
• Revenue insights

--------------------------------

📤 Exports

• PDF Export
• Excel Export
• CSV Export

--------------------------------

🧠 System Knowledge

• Architecture
• Project flow
• PDF export workflow
• Technology details

Try asking:

"What technologies are used in AI Agent?"
"Show projects of client ABC"
"Give proposal of AI Agent"
"Show all recent projects"`,
      format: 'markdown',
      verified: true,
      conversation: true,
    };
  }

  getShortHelp() {
    return {
      content: `I can help with project details, cost, technologies, proposals, timelines, client info, and system knowledge.

Try: *"Show details of Project YourProjectName"* or *"What technologies are used in Project X?"* or *"Show all recent projects"*`,
      format: 'conversation',
      verified: true,
      conversation: true,
    };
  }
}

module.exports = new AIHelpService();
