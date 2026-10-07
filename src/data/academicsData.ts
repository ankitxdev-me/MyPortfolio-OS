export interface Subject {
  code: string;
  name: string;
  credits: number;
  grade: string;
  keyLearning: string;
}

export interface DetailedSemester {
  slug: string;
  title: string;
  term: string;
  year?: number;
  semesterName?: string;
  sgpa: number;
  credits: number;
  status: 'Completed' | 'In Progress' | 'Draft' | 'Planned' | 'Upcoming' | string;
  published?: boolean;
  featured?: boolean;
  subjects: Subject[];
  courses?: any[];
  summary: string;
  connectedProjectSlugs: string[];
}

export interface AcademicHonor {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export interface CGPADataPoint {
  semester: string;
  sgpa: number;
  cgpa: number;
}

export const ACADEMIC_OVERVIEW = {
  degree: 'B.Tech in Computer Science & Engineering',
  university: 'State Technological University',
  duration: '2023 – 2027',
  cgpa: 8.9,
  scale: 10.0,
  currentSemester: 'Semester 6 (Final Year)',
  totalCredits: 120,
};

export const CGPA_HISTORY: CGPADataPoint[] = [
  { semester: 'Sem 1', sgpa: 8.5, cgpa: 8.5 },
  { semester: 'Sem 2', sgpa: 8.7, cgpa: 8.6 },
  { semester: 'Sem 3', sgpa: 9.0, cgpa: 8.7 },
  { semester: 'Sem 4', sgpa: 9.1, cgpa: 8.8 },
  { semester: 'Sem 5', sgpa: 9.2, cgpa: 8.9 },
  { semester: 'Sem 6', sgpa: 9.0, cgpa: 8.9 },
];

export const ACADEMIC_HONORS: AcademicHonor[] = [
  {
    id: '1',
    title: 'Dean’s Honor List for Academic Excellence',
    organization: 'Faculty of Engineering',
    year: '2025 & 2026',
    description: 'Awarded for maintaining top 5% academic standing across Semesters 4 and 5.',
  },
  {
    id: '2',
    title: 'First Place – University Annual Hackathon',
    organization: 'Tech Club STU',
    year: '2025',
    description: 'Built real-time automated verification tool selected as best technical architecture.',
  },
];

export const SEMESTERS_LIST: DetailedSemester[] = [
  {
    slug: 'semester-6',
    title: 'Semester 6',
    term: 'Spring 2026',
    sgpa: 9.0,
    credits: 22,
    status: 'In Progress',
    summary: 'Focusing on distributed systems, AI agentic execution, and capstone system architecture.',
    subjects: [
      { code: 'CS601', name: 'Distributed Systems & Microservices', credits: 4, grade: 'A+', keyLearning: 'Event-driven architecture, Redis message queues, and worker pool scaling.' },
      { code: 'CS602', name: 'Artificial Intelligence & Agentic Workflows', credits: 4, grade: 'A+', keyLearning: 'LangChain, vector embeddings, and autonomous task orchestration.' },
      { code: 'CS603', name: 'Cloud Native Infrastructure & DevOps', credits: 4, grade: 'A', keyLearning: 'Docker multi-stage builds, Kubernetes orchestration, and CI/CD pipelines.' },
    ],
    connectedProjectSlugs: ['autoops-ai'],
  },
  {
    slug: 'semester-5',
    title: 'Semester 5',
    term: 'Fall 2025',
    sgpa: 9.2,
    credits: 20,
    status: 'Completed',
    summary: 'Advanced database indexing, web development frameworks, and computer networks.',
    subjects: [
      { code: 'CS501', name: 'Database Management Systems (DBMS)', credits: 4, grade: 'A+', keyLearning: 'B-Tree indexing, SQL query optimization, and transaction isolation levels.' },
      { code: 'CS502', name: 'Web Engineering & Architecture', credits: 4, grade: 'A+', keyLearning: 'Single-page applications, SSR/SSG rendering patterns, and REST API design.' },
      { code: 'CS503', name: 'Computer Networks & Protocols', credits: 4, grade: 'A', keyLearning: 'TCP/IP socket programming, HTTP/2 multiplexing, and WebSockets.' },
    ],
    connectedProjectSlugs: ['teleadmin-bot', 'cryptex-os'],
  },
];
