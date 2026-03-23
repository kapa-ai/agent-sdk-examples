import { type ToolDefinition } from "@kapaai/agent-core";
import { z } from "zod";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_PROJECTS = [
  {
    id: "proj-1",
    name: "Acme Web App",
    status: "active",
    members: 8,
    lastActivity: "2 hours ago",
  },
  {
    id: "proj-2",
    name: "Mobile API",
    status: "active",
    members: 4,
    lastActivity: "15 minutes ago",
  },
  {
    id: "proj-3",
    name: "Internal Tools",
    status: "paused",
    members: 2,
    lastActivity: "3 days ago",
  },
  {
    id: "proj-4",
    name: "Data Pipeline v2",
    status: "active",
    members: 5,
    lastActivity: "1 hour ago",
  },
];

const MOCK_PROJECT_DETAILS: Record<string, object> = {
  "proj-1": {
    id: "proj-1",
    name: "Acme Web App",
    status: "active",
    createdAt: "2025-09-12",
    members: [
      { name: "Alice Chen", role: "owner", email: "alice@acme.io" },
      { name: "Bob Martinez", role: "admin", email: "bob@acme.io" },
    ],
    settings: { region: "us-east-1", tier: "pro", autoScaling: true },
    usage: { apiCalls: 145_230, storage: "2.3 GB", bandwidth: "12.1 GB" },
  },
  "proj-2": {
    id: "proj-2",
    name: "Mobile API",
    status: "active",
    createdAt: "2026-01-05",
    members: [
      { name: "Alice Chen", role: "owner", email: "alice@acme.io" },
      { name: "Dave Park", role: "member", email: "dave@acme.io" },
    ],
    settings: { region: "eu-west-1", tier: "starter", autoScaling: false },
    usage: { apiCalls: 32_100, storage: "450 MB", bandwidth: "3.2 GB" },
  },
};

export const tools: ToolDefinition[] = [
  {
    name: "list_projects",
    description:
      "List all projects for the current user with their status and recent activity",
    parameters: z.object({}),
    displayName: "List Projects",
    execute: async () => {
      await delay(400);
      return MOCK_PROJECTS;
    },
  },
  {
    name: "get_project_details",
    description:
      "Get detailed information about a specific project including members, settings, and usage",
    parameters: z.object({
      project_id: z.string().describe("The project ID (e.g. proj-1)"),
    }),
    displayName: "Project Details",
    execute: async ({ project_id }) => {
      await delay(600);
      const project = MOCK_PROJECT_DETAILS[project_id as string];
      if (!project) return { error: `Project ${project_id} not found` };
      return project;
    },
  },
  {
    name: "get_usage_stats",
    description: "Get API usage statistics for the current billing period",
    parameters: z.object({}),
    displayName: "Usage Stats",
    execute: async () => {
      await delay(500);
      return {
        plan: "Pro",
        billingPeriod: "Mar 1 - Mar 31, 2026",
        apiCalls: { used: 245_800, limit: 500_000 },
        storage: { used: 4.8, limit: 10, unit: "GB" },
        bandwidth: { used: 28.3, limit: 50, unit: "GB" },
      };
    },
  },
  {
    name: "invite_team_member",
    description: "Invite a new team member to a project by email",
    parameters: z.object({
      project_id: z.string().describe("The project ID"),
      email: z.string().describe("Email address of the person to invite"),
      role: z.enum(["admin", "member", "viewer"]).describe("Role to assign"),
    }),
    displayName: "Invite Team Member",
    needsApproval: true,
    execute: async ({ project_id, email, role }) => {
      await delay(800);
      return {
        success: true,
        message: `Invitation sent to ${email} as ${role} on project ${project_id}`,
      };
    },
  },
  {
    name: "create_project",
    description: "Create a new project with the given name, region, and tier",
    parameters: z.object({
      name: z.string().describe("Project name"),
      region: z
        .enum(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"])
        .describe("Deployment region"),
      tier: z.enum(["starter", "pro", "enterprise"]).describe("Pricing tier"),
    }),
    displayName: "Create Project",
    needsApproval: true,
    execute: async ({ name, region, tier }) => {
      await delay(1000);
      return {
        success: true,
        project: {
          id: `proj-${Date.now()}`,
          name,
          region,
          tier,
          status: "active",
        },
      };
    },
  },
];
