// NTENT Discovery Questions for Business Case Builder
export const BUSINESS_CASE_NTENT_QUESTIONS = {
  companyName: {
    dimension: 'next',
    question: 'Use full legal entity name - this appears on MSA/PO. Who signs contracts?',
    why: 'Legal entity clarity prevents contract delays'
  },
  
  industry: {
    dimension: 'need',
    question: 'What industry-specific compliance drives urgency? (HIPAA, PCI, SOX)',
    why: 'Industry drives security requirements and timeline'
  },
  
  totalUsers: {
    dimension: 'need',
    question: 'How many users need access TODAY vs. next 12 months? What drives growth?',
    why: 'User count impacts licensing, infrastructure, and project scope'
  },
  
  userProfile: {
    dimension: 'risk',
    question: 'What % are power users? GPU needs? What breaks their current setup?',
    why: 'User profile drives compute requirements and testing complexity'
  },
  
  numberOfUseCases: {
    dimension: 'need',
    question: 'What are the TOP 3 use cases? Which one fails most often today?',
    why: 'Each use case adds complexity - prioritize the pain points'
  },
  
  numberOfApplications: {
    dimension: 'risk',
    question: 'How many are CRITICAL? How many tested in cloud? Which have no vendor support?',
    why: 'App count predicts testing effort and modernization needs'
  },
  
  currentPlatform: {
    dimension: 'risk',
    question: 'What platform TODAY? What do they HATE about it? When does contract end?',
    why: 'Current platform reveals migration complexity and renewal timing'
  },
  
  plannedStartDate: {
    dimension: 'next',
    question: 'What HAS to happen before you can start? Who needs to approve start?',
    why: 'Start date dependencies reveal hidden blockers'
  },
  
  targetGoLiveDate: {
    dimension: 'time',
    question: 'What happens if you miss this date? Who set this deadline and why?',
    why: 'Compelling events create urgency and reveal true priority'
  },
  
  compellingEvent: {
    dimension: 'time',
    question: 'Contract expiring? Data center closing? Compliance deadline? M&A activity?',
    why: 'Compelling events are immovable - they drive deal velocity'
  },
  
  primaryContact: {
    dimension: 'teams',
    question: 'Are they the champion? Do they control budget? Who is their boss?',
    why: 'Primary contact must have influence and internal political capital'
  },
  
  technicalContact: {
    dimension: 'teams',
    question: 'Do they recommend or approve? What tech do they love/hate? Who do they report to?',
    why: 'Technical contact can block or accelerate - understand their power'
  },
  
  financialContact: {
    dimension: 'next',
    question: 'Do they approve POs? What is their approval limit? When do they review?',
    why: 'Financial approval process and limits determine close timeline'
  }
};
