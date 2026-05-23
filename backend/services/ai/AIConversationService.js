/**
 * Human conversation layer — greetings, help, small talk (no project hallucination)
 */

const AINLPService = require('./AINLPService');

const CONVERSATION_INTENTS = [
  'greeting', 'farewell', 'thanks', 'help', 'introduction', 'smalltalk', 'general',
];

const GREETING_PATTERNS = [
  /^(hi+|hello+|hey+|hii+|hlo+|yo+)\b/i,
  /^good\s+(morning|afternoon|evening|night)\b/i,
  /^(hi|hello|hey)\s+(bot|ai|assistant)\b/i,
  /^(hello|hi)\s+assistant\b/i,
];

const FAREWELL_PATTERNS = [
  /^(bye+|goodbye+|see\s+you|see\s+ya|cya|good\s+night)\b/i,
  /\b(farewell|take\s+care)\b/i,
];

const THANKS_PATTERNS = [
  /^(thanks?|thank\s+you|thx|ty|tysm|appreciate\s+it)\b/i,
  /\b(thanks\s+a\s+lot|thank\s+you\s+so\s+much)\b/i,
];

const HELP_PATTERNS = [
  /^help\b/i,
  /^help\s+me\b/i,
  /\bwhat\s+can\s+you\s+do\b/i,
  /\bhow\s+do\s+i\s+use\s+(this|you|it)\b/i,
  /\bwhat\s+do\s+you\s+do\b/i,
  /\bhow\s+can\s+you\s+help\b/i,
  /\bcommands?\b/i,
  /\bcapabilities\b/i,
];

const INTRO_PATTERNS = [
  /\bwho\s+are\s+you\b/i,
  /\bwhat\s+are\s+you\b/i,
  /\btell\s+me\s+about\s+yourself\b/i,
  /\bintroduce\s+yourself\b/i,
  /\byour\s+name\b/i,
];

const SMALLTALK_PATTERNS = [
  /\bhow\s+are\s+you\b/i,
  /\bhow\s+r\s+u\b/i,
  /\bhow\s+is\s+it\s+going\b/i,
  /\bwhat'?s\s+up\b/i,
  /\bwassup\b/i,
  /\bhow\s+do\s+you\s+work\b/i,
  /\bare\s+you\s+(there|online|available)\b/i,
  /\bnice\s+to\s+meet\b/i,
];

class AIConversationService {
  normalize(text) {
    return (text || '')
      .trim()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  _hasProjectSignals(message, entities, intent) {
    if (entities?.projectName || entities?.clientName || entities?.companyName) return true;
    if (intent && AINLPService.requiresProject(intent)) return true;
    const n = this.normalize(message);
    const projectSignals = /\b(project|proposal|client|company|cost|price|budget|technology|technologies|export|timeline|scope|mongodb)\b/;
    if (projectSignals.test(n) && n.split(' ').length > 3) return true;
    return false;
  }

  detectConversationIntent(message, options = {}) {
    const { entities = {}, intent = null } = options;
    if (!message?.trim()) return null;
    if (this._hasProjectSignals(message, entities, intent)) return null;

    const raw = message.trim();
    const n = this.normalize(message);

    if (GREETING_PATTERNS.some((p) => p.test(raw) || p.test(n))) {
      if (n.split(' ').length <= 6) return 'greeting';
    }

    if (FAREWELL_PATTERNS.some((p) => p.test(raw) || p.test(n))) return 'farewell';
    if (THANKS_PATTERNS.some((p) => p.test(raw) || p.test(n))) return 'thanks';
    if (HELP_PATTERNS.some((p) => p.test(raw) || p.test(n))) return 'help';
    if (INTRO_PATTERNS.some((p) => p.test(raw) || p.test(n))) return 'introduction';
    if (SMALLTALK_PATTERNS.some((p) => p.test(raw) || p.test(n))) return 'smalltalk';

    if (n.split(' ').length <= 4 && /^(hi|hello|hey|yo|hii|hlo)\b/.test(n)) return 'greeting';

    return null;
  }

  _displayName(context = {}) {
    const name = context.userName || context.displayName;
    if (name && name !== 'anonymous') {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return null;
  }

  generateWelcomeMessage(context = {}) {
    const name = this._displayName(context);
    const greeting = name ? `👋 Hello **${name}**` : '👋 Hello';
    return `${greeting}

I'm your **ProposalForge AI Assistant**.

I can help with:

• Project details
• Proposal information
• Technologies used
• Project cost
• Client project search
• Scope of work
• Project timelines
• Technical project questions

Try:

*"Show projects of client ABC"*

or

*"What technologies are used in AI Agent - Trading Analysis?"*`;
  }

  handleGreeting(context = {}) {
    return {
      intent: 'greeting',
      format: 'conversation',
      content: this.generateWelcomeMessage(context),
      verified: true,
      conversation: true,
      followUpSuggestions: [
        'List all projects',
        'What can you do?',
        'How was PDF export implemented?',
      ],
    };
  }

  handleHelp() {
    return {
      intent: 'help',
      format: 'conversation',
      content: `I can help you with:

## 📁 Projects

• Project details
• Cost
• Timeline
• Status
• Scope

## 📄 Proposals

• View proposal details
• Proposal information

## 🧠 Technical

• Technologies
• Backend structure
• Project workflow

## 🔍 Search

• Search by project
• Search by client

Try: *"Show details of Project YourProjectName"* or *"What is the cost of YourProject?"*`,
      verified: true,
      conversation: true,
      followUpSuggestions: [
        'List all projects',
        'Show projects of client ABC',
        'Explain project structure',
      ],
    };
  }

  handleThanks() {
    return {
      intent: 'thanks',
      format: 'conversation',
      content: `You're welcome 👋

Let me know if you need project information.`,
      verified: true,
      conversation: true,
    };
  }

  handleFarewell() {
    return {
      intent: 'farewell',
      format: 'conversation',
      content: `Goodbye 👋

Feel free to return if you need help with ProposalForge AI projects.`,
      verified: true,
      conversation: true,
    };
  }

  handleSmallTalk(subIntent = 'smalltalk') {
    const responses = {
      introduction: `I'm **ProposalForge AI Assistant**, designed to help manage project information, proposals, technologies and client data.

I answer from your **MongoDB** database and verified system knowledge only.`,
      smalltalk: `I'm running properly and ready to help with your projects.`,
      general: `I'm here to help with ProposalForge project data. Ask me about a project, client, proposal, or technologies.`,
    };

    return {
      intent: subIntent,
      format: 'conversation',
      content: responses[subIntent] || responses.smalltalk,
      verified: true,
      conversation: true,
      followUpSuggestions: ['What can you do?', 'List all projects'],
    };
  }

  resolve(conversationIntent, context = {}) {
    switch (conversationIntent) {
      case 'greeting':
        return this.handleGreeting(context);
      case 'help':
        return this.handleHelp();
      case 'thanks':
        return this.handleThanks();
      case 'farewell':
        return this.handleFarewell();
      case 'introduction':
        return this.handleSmallTalk('introduction');
      case 'smalltalk':
        return this.handleSmallTalk('smalltalk');
      case 'general':
        return this.handleSmallTalk('general');
      default:
        return null;
    }
  }

  tryConversation(message, options = {}) {
    const convIntent = this.detectConversationIntent(message, options);
    if (!convIntent) return null;
    return this.resolve(convIntent, options.context || {});
  }
}

module.exports = new AIConversationService();
module.exports.CONVERSATION_INTENTS = CONVERSATION_INTENTS;
