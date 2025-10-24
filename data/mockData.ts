import { ProfileBlock, AISuggestion, Job, Application } from '../types';

export const userProfile = {
  name: 'Alex Chen',
  experience: '8 years',
  companies: ['Google', 'Microsoft'],
  completionPercentage: 85,
};

export const profileBlocks: ProfileBlock[] = [
  {
    id: 'work-1',
    category: 'Work',
    title: 'Senior Software Engineer - Google',
    content: 'Led development of cloud infrastructure platform serving 100M+ users. Built distributed systems using Go and Kubernetes, reducing deployment time by 60%. Managed team of 5 engineers.',
    icon: 'Briefcase',
    preview: 'Senior Software Engineer - Google',
  },
  {
    id: 'work-2',
    category: 'Work',
    title: 'Software Engineer - Microsoft',
    content: 'Developed Azure services using C# and .NET. Implemented microservices architecture reducing latency by 40%. Collaborated with cross-functional teams on cloud solutions.',
    icon: 'Briefcase',
    preview: 'Software Engineer - Microsoft',
  },
  {
    id: 'edu-1',
    category: 'Education',
    title: 'BS Computer Science - Stanford',
    content: 'Bachelor of Science in Computer Science. GPA: 3.8/4.0. Focus on distributed systems and algorithms.',
    icon: 'GraduationCap',
    preview: 'BS Computer Science - Stanford',
  },
  {
    id: 'skills-1',
    category: 'Skills',
    title: 'Technical Skills',
    content: 'Python, React, TypeScript, Go, AWS, Kubernetes, Docker, Terraform, microservices, distributed systems',
    icon: 'Code',
    preview: 'Python, React, AWS, Kubernetes...',
  },
  {
    id: 'project-1',
    category: 'Projects',
    title: 'Open Source Contribution',
    content: 'Core contributor to Kubernetes. Implemented auto-scaling features used by 50K+ organizations. 200+ commits, 15 merged PRs.',
    icon: 'FolderGit2',
    preview: 'Kubernetes Core Contributor',
  },
  {
    id: 'leadership-1',
    category: 'Leadership',
    title: 'Team Leadership',
    content: 'Led team of 5 engineers at Google. Mentored junior developers. Established code review processes improving code quality by 35%.',
    icon: 'Users',
    preview: 'Led team of 5 engineers',
  },
];

export const aiSuggestions: AISuggestion[] = [
  // Job-specific suggestions for Google (job-1)
  {
    id: 'sug-1',
    type: 'add',
    title: "Add 'Kubernetes' prominence",
    reason: "Key requirement for Google role",
    details: "The Google Cloud Infrastructure position heavily emphasizes Kubernetes expertise. Make it more prominent in your experience.",
    blockId: 'work-1',
    field: 'content',
    suggestedValue: 'Google (2021-Present): Led development of cloud infrastructure platform serving 100M+ users using Kubernetes and distributed systems. Expert in container orchestration, built systems using Go and Kubernetes, reducing deployment time by 60%. Managed team of 5 engineers.',
    jobId: 'job-1',
  },
  {
    id: 'sug-2',
    type: 'emphasize',
    title: 'Highlight Go experience',
    reason: 'Google prefers Go for infrastructure',
    details: "The job listing mentions Go as a primary language. Emphasize your Go expertise from your Google work.",
    blockId: 'work-1',
    field: 'content',
    suggestedValue: 'Google (2021-Present): Led development of cloud infrastructure platform serving 100M+ users. Built distributed systems primarily in Go, with expertise in Kubernetes and containerization, reducing deployment time by 60%. Managed team of 5 engineers.',
    jobId: 'job-1',
  },
  // Job-specific suggestions for Meta (job-2)
  {
    id: 'sug-3',
    type: 'emphasize',
    title: 'Emphasize team leadership scale',
    reason: 'Meta Tech Lead manages 8-10 engineers',
    details: "The Meta position requires leading larger teams. Highlight your potential to scale team leadership.",
    blockId: 'leadership-1',
    field: 'content',
    suggestedValue: 'Led cross-functional team of 5 engineers at Google, with experience scaling team processes. Mentored junior developers and established code review practices improving code quality by 35%. Ready to lead larger engineering teams.',
    jobId: 'job-2',
  },
  {
    id: 'sug-4',
    type: 'add',
    title: "Add 'microservices' keyword",
    reason: "Core requirement for Meta role",
    details: "Meta emphasizes microservices architecture. Your Microsoft experience should highlight this more prominently.",
    blockId: 'work-2',
    field: 'content',
    suggestedValue: 'Microsoft (2019-2021): Led development of cloud-native microservices for Azure infrastructure, scaling to handle 10M+ daily requests. Architected distributed systems using Kubernetes and Docker, reducing latency by 40%.',
    jobId: 'job-2',
  },
  {
    id: 'sug-5',
    type: 'quantify',
    title: 'Add billion-user scale context',
    reason: 'Meta operates at massive scale',
    details: "Meta's systems serve billions. Add scale context to demonstrate you can handle their requirements.",
    blockId: 'work-1',
    field: 'content',
    suggestedValue: 'Google (2021-Present): Led development of cloud infrastructure platform serving 100M+ users with systems designed for billion-request scale. Built distributed systems using Go and Kubernetes, reducing deployment time by 60%. Managed team of 5 engineers.',
    jobId: 'job-2',
  },
  // Job-specific suggestions for Netflix (job-3)
  {
    id: 'sug-6',
    type: 'add',
    title: "Highlight high-throughput systems",
    reason: 'Streaming requires high-performance infrastructure',
    details: "Netflix's streaming platform needs high-throughput expertise. Emphasize performance optimization from your Google work.",
    blockId: 'work-1',
    field: 'content',
    suggestedValue: 'Google (2021-Present): Led development of cloud infrastructure platform serving 100M+ users with high-throughput systems optimized for performance. Built distributed systems using Go and Kubernetes, reducing deployment time by 60% and optimizing data delivery pipelines. Managed team of 5 engineers.',
    jobId: 'job-3',
  },
  {
    id: 'sug-7',
    type: 'add',
    title: 'Emphasize AWS experience',
    reason: 'Netflix runs on AWS',
    details: "Netflix infrastructure is built on AWS. Highlight your cloud platform experience and AWS knowledge.",
    blockId: 'skills-1',
    field: 'content',
    suggestedValue: 'Python, React, TypeScript, Go, AWS (extensive experience), Kubernetes, Docker, Terraform, microservices, distributed systems, cloud infrastructure optimization',
    jobId: 'job-3',
  },
  // General suggestions (no jobId)
  {
    id: 'sug-gen-1',
    type: 'quantify',
    title: 'Add metrics to education',
    reason: 'Quantifiable achievements are more impactful',
    details: "Consider adding coursework, projects, or academic achievements to make your education section more compelling.",
    blockId: 'edu-1',
    field: 'content',
    suggestedValue: 'Bachelor of Science in Computer Science from Stanford University. GPA: 3.8/4.0. Specialized in distributed systems and algorithms. Completed advanced coursework in system design, databases, and machine learning.',
  },
  {
    id: 'sug-gen-2',
    type: 'emphasize',
    title: 'Expand open source contributions',
    reason: 'Demonstrates community engagement and expertise',
    details: "Your Kubernetes contributions are impressive. Consider adding more details about the impact and technologies used.",
    blockId: 'project-1',
    field: 'content',
    suggestedValue: 'Core contributor to Kubernetes (CNCF). Implemented auto-scaling features using Go, now used by 50K+ organizations worldwide. 200+ commits across controller and scheduler components, 15 merged PRs. Active in community code reviews and mentoring new contributors.',
  },
];

export const jobs: Job[] = [
  {
    id: 'job-1',
    company: 'Google',
    title: 'Senior Software Engineer - Cloud Infrastructure',
    posting: `We're looking for a Senior Software Engineer to join our Cloud Infrastructure team. You'll work on distributed systems that serve billions of requests daily.

Requirements:
- 5+ years experience with distributed systems
- Strong background in Go, Python, or Java
- Experience with Kubernetes and containerization
- Proven track record of building scalable systems
- Team leadership experience preferred

Responsibilities:
- Design and implement cloud infrastructure solutions
- Lead technical discussions and architectural decisions
- Mentor junior engineers
- Optimize system performance and reliability`,
    keywords: ['distributed systems', 'Kubernetes', 'cloud infrastructure', 'Go', 'Python', 'scalability', 'team leadership'],
    matchScore: 78,
    strongMatches: ['Distributed systems experience', 'Kubernetes expertise', 'Cloud platform background', 'Team leadership'],
    gaps: ['No Java experience listed', 'Limited Go visibility'],
  },
  {
    id: 'job-2',
    company: 'Meta',
    title: 'Tech Lead - Distributed Systems',
    posting: `Meta is seeking a Tech Lead for our Distributed Systems team. You'll architect solutions that power our global infrastructure.

Requirements:
- 7+ years software engineering experience
- Expertise in distributed systems and microservices
- Strong leadership and mentoring skills
- Experience with large-scale systems
- Python, C++, or Rust proficiency

You will:
- Lead a team of 8-10 engineers
- Design system architecture for billion-user scale
- Drive technical strategy and roadmap
- Collaborate across engineering teams`,
    keywords: ['distributed systems', 'microservices', 'leadership', 'Python', 'large-scale', 'architecture'],
    matchScore: 82,
    strongMatches: ['Leadership experience', 'Distributed systems', 'Python expertise', 'Scale experience'],
    gaps: ['No C++ or Rust mentioned'],
  },
  {
    id: 'job-3',
    company: 'Netflix',
    title: 'Senior Engineer - Streaming Platform',
    posting: `Join Netflix's Streaming Platform team to build the infrastructure powering entertainment for 200M+ members worldwide.

Requirements:
- 6+ years building high-performance systems
- Experience with streaming or high-throughput systems
- AWS, microservices, and containerization
- Strong problem-solving and optimization skills
- Team collaboration experience

What you'll do:
- Build streaming infrastructure components
- Optimize for performance and cost
- Work with encoding, CDN, and delivery teams
- Improve reliability and user experience`,
    keywords: ['streaming', 'high-performance', 'AWS', 'microservices', 'optimization', 'infrastructure'],
    matchScore: 71,
    strongMatches: ['AWS experience', 'Microservices', 'Infrastructure background'],
    gaps: ['No direct streaming experience', 'Limited media tech visibility'],
  },
];

export const applications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    company: 'Stripe',
    position: 'Senior Backend Engineer',
    status: 'Interview',
    appliedDate: '2025-10-15',
    blocksUsed: ['work-1', 'work-2', 'skills-1', 'edu-1'],
    lastUpdate: '2025-10-19',
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    company: 'Airbnb',
    position: 'Staff Engineer - Infrastructure',
    status: 'Viewed',
    appliedDate: '2025-10-12',
    blocksUsed: ['work-1', 'skills-1', 'project-1', 'edu-1'],
    lastUpdate: '2025-10-14',
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    company: 'Uber',
    position: 'Tech Lead - Platform',
    status: 'Submitted',
    appliedDate: '2025-10-18',
    blocksUsed: ['work-1', 'work-2', 'leadership-1', 'skills-1'],
  },
  {
    id: 'app-4',
    jobId: 'job-1',
    company: 'Coinbase',
    position: 'Engineering Manager',
    status: 'Rejected',
    appliedDate: '2025-10-05',
    blocksUsed: ['work-1', 'leadership-1', 'edu-1'],
    lastUpdate: '2025-10-10',
  },
  {
    id: 'app-5',
    jobId: 'job-2',
    company: 'Snowflake',
    position: 'Senior SWE',
    status: 'No Response',
    appliedDate: '2025-10-01',
    blocksUsed: ['work-1', 'work-2', 'skills-1'],
  },
];

export const stats = {
  submitted: 12,
  inProgress: 3,
  interviews: 2,
  responseRate: 67,
};
