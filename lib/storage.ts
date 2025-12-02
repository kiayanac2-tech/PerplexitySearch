import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  AGENTS: "@vcenter/agents",
  JOB_POSTINGS: "@vcenter/job_postings",
  APPLICATIONS: "@vcenter/applications",
  TRAINING_MODULES: "@vcenter/training_modules",
  CAMPAIGNS: "@vcenter/campaigns",
  AUTH: "@vcenter/auth",
  METRICS: "@vcenter/metrics",
};

export type AgentStatus = "available" | "busy" | "break" | "offline";
export type UserRole = "admin" | "supervisor" | "agent";
export type ApplicationStatus = "pending" | "reviewing" | "interview" | "approved" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AgentStatus;
  avatarIndex: number;
  employeeId: string;
  department: string;
  currentTask?: string;
  callsHandled: number;
  avgResponseTime: number;
  rating: number;
  hireDate: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  department: string;
  type: "full-time" | "part-time" | "contract";
  location: string;
  salary: string;
  isActive: boolean;
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: "onboarding" | "product" | "communication" | "compliance" | "advanced";
  duration: string;
  isRequired: boolean;
  completionRate: number;
  contentUrl?: string;
  order: number;
}

export interface Campaign {
  id: string;
  name: string;
  client: string;
  description: string;
  status: "active" | "paused" | "completed";
  agentsAssigned: number;
  callsToday: number;
  conversionRate: number;
  startDate: string;
  endDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarIndex: number;
  employeeId: string;
  department: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface BusinessMetrics {
  totalAgents: number;
  activeAgents: number;
  totalApplications: number;
  pendingApplications: number;
  totalCalls: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  revenue: number;
  activeCampaigns: number;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const MOCK_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@vcenter.com",
    phone: "+1 (555) 123-4567",
    role: "supervisor",
    status: "available",
    avatarIndex: 0,
    employeeId: "EMP001",
    department: "Customer Support",
    currentTask: undefined,
    callsHandled: 156,
    avgResponseTime: 2.3,
    rating: 4.8,
    hireDate: "2023-06-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Marcus Williams",
    email: "marcus.williams@vcenter.com",
    phone: "+1 (555) 234-5678",
    role: "agent",
    status: "busy",
    avatarIndex: 1,
    employeeId: "EMP002",
    department: "Sales",
    currentTask: "Outbound Sales Call",
    callsHandled: 89,
    avgResponseTime: 3.1,
    rating: 4.5,
    hireDate: "2023-09-01",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Emily Chen",
    email: "emily.chen@vcenter.com",
    phone: "+1 (555) 345-6789",
    role: "agent",
    status: "available",
    avatarIndex: 2,
    employeeId: "EMP003",
    department: "Technical Support",
    currentTask: undefined,
    callsHandled: 124,
    avgResponseTime: 2.8,
    rating: 4.9,
    hireDate: "2023-07-20",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.rodriguez@vcenter.com",
    phone: "+1 (555) 456-7890",
    role: "agent",
    status: "break",
    avatarIndex: 3,
    employeeId: "EMP004",
    department: "Customer Support",
    currentTask: undefined,
    callsHandled: 67,
    avgResponseTime: 3.5,
    rating: 4.2,
    hireDate: "2024-01-10",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "aisha.patel@vcenter.com",
    phone: "+1 (555) 567-8901",
    role: "agent",
    status: "offline",
    avatarIndex: 4,
    employeeId: "EMP005",
    department: "Sales",
    currentTask: undefined,
    callsHandled: 201,
    avgResponseTime: 2.1,
    rating: 4.7,
    hireDate: "2023-04-05",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@vcenter.com",
    phone: "+1 (555) 678-9012",
    role: "agent",
    status: "busy",
    avatarIndex: 5,
    employeeId: "EMP006",
    department: "Technical Support",
    currentTask: "Software Troubleshooting",
    callsHandled: 143,
    avgResponseTime: 4.2,
    rating: 4.6,
    hireDate: "2023-11-01",
    createdAt: new Date().toISOString(),
  },
];

const MOCK_JOB_POSTINGS: JobPosting[] = [
  {
    id: "j1",
    title: "Remote Customer Service Representative",
    description: "Join our growing virtual call center team! We're looking for motivated individuals to provide exceptional customer service from the comfort of their homes. You'll handle inbound calls, resolve customer inquiries, and maintain high satisfaction ratings.",
    requirements: [
      "High school diploma or equivalent",
      "Excellent communication skills",
      "Reliable high-speed internet connection",
      "Quiet home office environment",
      "Basic computer proficiency",
      "Flexible availability",
    ],
    benefits: [
      "Work from home",
      "Flexible scheduling",
      "Paid training provided",
      "Performance bonuses",
      "Health insurance options",
      "Career advancement opportunities",
    ],
    department: "Customer Support",
    type: "full-time",
    location: "Remote - USA",
    salary: "$15-$20/hour",
    isActive: true,
    applicationsCount: 24,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "j2",
    title: "Virtual Sales Agent",
    description: "Exciting opportunity for sales-driven individuals! Make outbound calls to potential customers, present our products and services, and close deals. Unlimited earning potential with our competitive commission structure.",
    requirements: [
      "Previous sales experience preferred",
      "Strong persuasion skills",
      "Goal-oriented mindset",
      "Comfortable with cold calling",
      "CRM experience a plus",
    ],
    benefits: [
      "Base pay plus commission",
      "Uncapped earnings",
      "Weekly bonuses",
      "Flexible hours",
      "Comprehensive training",
    ],
    department: "Sales",
    type: "full-time",
    location: "Remote - Nationwide",
    salary: "$12/hour + commission",
    isActive: true,
    applicationsCount: 18,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "j3",
    title: "Technical Support Specialist",
    description: "Help customers troubleshoot technical issues and provide solutions. Ideal for tech-savvy individuals who enjoy problem-solving and helping others.",
    requirements: [
      "Technical aptitude required",
      "Experience with troubleshooting",
      "Patience and empathy",
      "Typing speed 40+ WPM",
      "Available for evening shifts",
    ],
    benefits: [
      "Higher pay rate",
      "Technical certifications",
      "Equipment provided",
      "Shift differentials",
    ],
    department: "Technical Support",
    type: "part-time",
    location: "Remote - USA",
    salary: "$18-$25/hour",
    isActive: true,
    applicationsCount: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app1",
    jobId: "j1",
    name: "Jennifer Martinez",
    email: "jennifer.m@email.com",
    phone: "+1 (555) 111-2222",
    experience: "3 years of customer service experience at a retail company. Handled phone and email inquiries.",
    coverLetter: "I am excited to apply for the Remote Customer Service Representative position. My background in retail customer service has prepared me well for this role.",
    status: "pending",
    notes: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app2",
    jobId: "j2",
    name: "Robert Thompson",
    email: "robert.t@email.com",
    phone: "+1 (555) 333-4444",
    experience: "5 years in B2B sales. Consistently exceeded quotas by 20%.",
    coverLetter: "As a proven sales professional, I am confident I can contribute to your team's success.",
    status: "interview",
    notes: "Strong candidate. Schedule video interview.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app3",
    jobId: "j1",
    name: "Michelle Lee",
    email: "michelle.lee@email.com",
    phone: "+1 (555) 555-6666",
    experience: "Recent graduate with internship experience in call center operations.",
    coverLetter: "I am eager to start my career in customer service with your company.",
    status: "reviewing",
    notes: "Entry level but enthusiastic",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_TRAINING_MODULES: TrainingModule[] = [
  {
    id: "t1",
    title: "Welcome to the Team",
    description: "Introduction to our company culture, mission, and values. Learn about your role and expectations.",
    category: "onboarding",
    duration: "30 min",
    isRequired: true,
    completionRate: 100,
    order: 1,
  },
  {
    id: "t2",
    title: "Systems & Tools Training",
    description: "Learn how to use our CRM, phone system, and other essential tools for daily operations.",
    category: "onboarding",
    duration: "1 hour",
    isRequired: true,
    completionRate: 95,
    order: 2,
  },
  {
    id: "t3",
    title: "Customer Communication Excellence",
    description: "Master the art of professional phone etiquette, active listening, and conflict resolution.",
    category: "communication",
    duration: "45 min",
    isRequired: true,
    completionRate: 88,
    order: 3,
  },
  {
    id: "t4",
    title: "Product Knowledge Deep Dive",
    description: "Comprehensive overview of our products and services to help customers effectively.",
    category: "product",
    duration: "2 hours",
    isRequired: true,
    completionRate: 82,
    order: 4,
  },
  {
    id: "t5",
    title: "Compliance & Data Security",
    description: "Understanding privacy regulations, data handling procedures, and security protocols.",
    category: "compliance",
    duration: "1 hour",
    isRequired: true,
    completionRate: 90,
    order: 5,
  },
  {
    id: "t6",
    title: "Advanced Sales Techniques",
    description: "Learn upselling, cross-selling, and closing strategies to maximize conversions.",
    category: "advanced",
    duration: "1.5 hours",
    isRequired: false,
    completionRate: 45,
    order: 6,
  },
  {
    id: "t7",
    title: "Handling Difficult Customers",
    description: "Strategies for de-escalation and turning negative experiences into positive outcomes.",
    category: "communication",
    duration: "45 min",
    isRequired: false,
    completionRate: 67,
    order: 7,
  },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Holiday Support Surge",
    client: "TechGiant Inc.",
    description: "Extended customer support for holiday shopping season.",
    status: "active",
    agentsAssigned: 4,
    callsToday: 234,
    conversionRate: 0,
    startDate: "2024-11-01",
    endDate: "2025-01-15",
  },
  {
    id: "c2",
    name: "New Product Launch",
    client: "Innovate Corp",
    description: "Outbound sales campaign for new product line introduction.",
    status: "active",
    agentsAssigned: 3,
    callsToday: 156,
    conversionRate: 23.5,
    startDate: "2024-11-15",
  },
  {
    id: "c3",
    name: "Customer Retention",
    client: "ServiceFirst LLC",
    description: "Reach out to at-risk customers with special offers.",
    status: "paused",
    agentsAssigned: 2,
    callsToday: 0,
    conversionRate: 18.2,
    startDate: "2024-10-01",
  },
];

export const storage = {
  async initializeData(): Promise<void> {
    try {
      const agents = await AsyncStorage.getItem(STORAGE_KEYS.AGENTS);
      if (!agents) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.AGENTS,
          JSON.stringify(MOCK_AGENTS)
        );
      }

      const jobPostings = await AsyncStorage.getItem(STORAGE_KEYS.JOB_POSTINGS);
      if (!jobPostings) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.JOB_POSTINGS,
          JSON.stringify(MOCK_JOB_POSTINGS)
        );
      }

      const applications = await AsyncStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (!applications) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.APPLICATIONS,
          JSON.stringify(MOCK_APPLICATIONS)
        );
      }

      const trainingModules = await AsyncStorage.getItem(STORAGE_KEYS.TRAINING_MODULES);
      if (!trainingModules) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.TRAINING_MODULES,
          JSON.stringify(MOCK_TRAINING_MODULES)
        );
      }

      const campaigns = await AsyncStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      if (!campaigns) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CAMPAIGNS,
          JSON.stringify(MOCK_CAMPAIGNS)
        );
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AGENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting agents:", error);
      return [];
    }
  },

  async getAgent(id: string): Promise<Agent | null> {
    try {
      const agents = await this.getAgents();
      return agents.find((a) => a.id === id) || null;
    } catch (error) {
      console.error("Error getting agent:", error);
      return null;
    }
  },

  async updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
    try {
      const agents = await this.getAgents();
      const index = agents.findIndex((a) => a.id === id);
      if (index !== -1) {
        agents[index] = { ...agents[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  },

  async getJobPostings(): Promise<JobPosting[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOB_POSTINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting job postings:", error);
      return [];
    }
  },

  async createJobPosting(
    posting: Omit<JobPosting, "id" | "createdAt" | "applicationsCount">
  ): Promise<JobPosting> {
    try {
      const postings = await this.getJobPostings();
      const newPosting: JobPosting = {
        ...posting,
        id: generateId(),
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
      };
      postings.unshift(newPosting);
      await AsyncStorage.setItem(
        STORAGE_KEYS.JOB_POSTINGS,
        JSON.stringify(postings)
      );
      return newPosting;
    } catch (error) {
      console.error("Error creating job posting:", error);
      throw error;
    }
  },

  async updateJobPosting(id: string, updates: Partial<JobPosting>): Promise<void> {
    try {
      const postings = await this.getJobPostings();
      const index = postings.findIndex((p) => p.id === id);
      if (index !== -1) {
        postings[index] = { ...postings[index], ...updates };
        await AsyncStorage.setItem(
          STORAGE_KEYS.JOB_POSTINGS,
          JSON.stringify(postings)
        );
      }
    } catch (error) {
      console.error("Error updating job posting:", error);
    }
  },

  async getApplications(): Promise<Application[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting applications:", error);
      return [];
    }
  },

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    try {
      const applications = await this.getApplications();
      return applications.filter((a) => a.jobId === jobId);
    } catch (error) {
      console.error("Error getting applications for job:", error);
      return [];
    }
  },

  async createApplication(
    application: Omit<Application, "id" | "createdAt" | "updatedAt" | "status" | "notes">
  ): Promise<Application> {
    try {
      const applications = await this.getApplications();
      const newApplication: Application = {
        ...application,
        id: generateId(),
        status: "pending",
        notes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      applications.unshift(newApplication);
      await AsyncStorage.setItem(
        STORAGE_KEYS.APPLICATIONS,
        JSON.stringify(applications)
      );

      const postings = await this.getJobPostings();
      const postingIndex = postings.findIndex((p) => p.id === application.jobId);
      if (postingIndex !== -1) {
        postings[postingIndex].applicationsCount += 1;
        await AsyncStorage.setItem(
          STORAGE_KEYS.JOB_POSTINGS,
          JSON.stringify(postings)
        );
      }

      return newApplication;
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  },

  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    try {
      const applications = await this.getApplications();
      const index = applications.findIndex((a) => a.id === id);
      if (index !== -1) {
        applications[index] = {
          ...applications[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(
          STORAGE_KEYS.APPLICATIONS,
          JSON.stringify(applications)
        );
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  },

  async getTrainingModules(): Promise<TrainingModule[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRAINING_MODULES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting training modules:", error);
      return [];
    }
  },

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting campaigns:", error);
      return [];
    }
  },

  async getMetrics(): Promise<BusinessMetrics> {
    try {
      const agents = await this.getAgents();
      const applications = await this.getApplications();
      const campaigns = await this.getCampaigns();

      const activeAgents = agents.filter(
        (a) => a.status === "available" || a.status === "busy"
      ).length;
      const pendingApplications = applications.filter(
        (a) => a.status === "pending"
      ).length;
      const totalCalls = agents.reduce((sum, a) => sum + a.callsHandled, 0);
      const avgResponseTime =
        agents.length > 0
          ? agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length
          : 0;
      const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

      return {
        totalAgents: agents.length,
        activeAgents,
        totalApplications: applications.length,
        pendingApplications,
        totalCalls,
        avgResponseTime: Math.round(avgResponseTime * 10) / 10,
        customerSatisfaction: 4.6,
        revenue: 45750,
        activeCampaigns,
      };
    } catch (error) {
      console.error("Error getting metrics:", error);
      return {
        totalAgents: 0,
        activeAgents: 0,
        totalApplications: 0,
        pendingApplications: 0,
        totalCalls: 0,
        avgResponseTime: 0,
        customerSatisfaction: 0,
        revenue: 0,
        activeCampaigns: 0,
      };
    }
  },

  async getAuth(): Promise<AuthState> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
      return data
        ? JSON.parse(data)
        : { isAuthenticated: false, user: null };
    } catch (error) {
      console.error("Error getting auth:", error);
      return { isAuthenticated: false, user: null };
    }
  },

  async login(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated: true, user })
      );
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated: false, user: null })
      );
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
