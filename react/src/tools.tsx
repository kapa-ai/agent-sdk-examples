import { createToolHelper, type AgentTool } from "@kapaai/agent-react";
import { z } from "zod";

type ToolContext = {
  userId: string;
};

const tool = createToolHelper<ToolContext>();

// -- Mock data --

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
      { name: "Carol Kim", role: "member", email: "carol@acme.io" },
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

const MOCK_USAGE = {
  plan: "Pro",
  billingPeriod: "Mar 1 – Mar 31, 2026",
  apiCalls: { used: 245_800, limit: 500_000 },
  storage: { used: 4.8, limit: 10, unit: "GB" },
  bandwidth: { used: 28.3, limit: 50, unit: "GB" },
  teamMembers: { used: 12, limit: 25 },
};

// -- Render helpers --

const stat = (label: string, value: string) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "4px 0",
    }}
  >
    <span style={{ opacity: 0.6, fontSize: 13 }}>{label}</span>
    <span style={{ fontWeight: 600, fontSize: 13 }}>{value}</span>
  </div>
);

const progressBar = (used: number, limit: number) => {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 80 ? "#fa5252" : pct > 60 ? "#fab005" : "#40c057";
  return (
    <div
      style={{
        borderRadius: 4,
        height: 6,
        overflow: "hidden",
        marginTop: 4,
        background: "rgba(128,128,128,0.25)",
      }}
    >
      <div
        style={{
          background: color,
          height: "100%",
          width: `${pct}%`,
          borderRadius: 4,
        }}
      />
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 8,
  fontSize: 13,
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// -- Tools --

export const exampleTools: AgentTool<ToolContext>[] = [
  tool({
    name: "list_projects",
    description:
      "List all projects for the current user with their status and recent activity",
    parameters: z.object({}),
    displayName: "List Projects",
    execute: async () => {
      await delay(400);
      return MOCK_PROJECTS;
    },
  }),

  tool({
    name: "get_project_details",
    description:
      "Get detailed information about a specific project including members, settings, and usage",
    parameters: z.object({
      project_id: z.string().describe("The project ID (e.g. proj-1)"),
    }),
    displayName: "Project Details",
    execute: async ({ project_id }) => {
      await delay(600);
      const project = MOCK_PROJECT_DETAILS[project_id];
      if (!project) return { error: `Project ${project_id} not found` };
      return project;
    },
  }),

  tool({
    name: "get_usage_stats",
    description:
      "Get API usage statistics for the current billing period including API calls, storage, and bandwidth",
    parameters: z.object({}),
    displayName: "Usage Stats",
    execute: async () => {
      await delay(500);
      return MOCK_USAGE;
    },
    render: ({ status, result }) => {
      if (status === "executing") {
        return <div style={cardStyle}>Loading usage data...</div>;
      }
      if (status === "completed") {
        const d = result as typeof MOCK_USAGE;
        const fmtNum = (n: number) => n.toLocaleString();
        return (
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {d.plan} Plan — {d.billingPeriod}
            </div>
            {stat(
              "API Calls",
              `${fmtNum(d.apiCalls.used)} / ${fmtNum(d.apiCalls.limit)}`
            )}
            {progressBar(d.apiCalls.used, d.apiCalls.limit)}
            <div style={{ height: 4 }} />
            {stat(
              "Storage",
              `${d.storage.used} ${d.storage.unit} / ${d.storage.limit} ${d.storage.unit}`
            )}
            {progressBar(d.storage.used, d.storage.limit)}
            <div style={{ height: 4 }} />
            {stat(
              "Bandwidth",
              `${d.bandwidth.used} ${d.bandwidth.unit} / ${d.bandwidth.limit} ${d.bandwidth.unit}`
            )}
            {progressBar(d.bandwidth.used, d.bandwidth.limit)}
            <div style={{ height: 4 }} />
            {stat(
              "Team Members",
              `${d.teamMembers.used} / ${d.teamMembers.limit}`
            )}
          </div>
        );
      }
      return null;
    },
  }),

  tool({
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
        inviteId: `inv-${Date.now()}`,
      };
    },
  }),

  tool({
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
          createdAt: new Date().toISOString(),
        },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed") {
        const data = result as {
          success: boolean;
          project: { id: string; name: string; region: string; tier: string };
        };
        return (
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, color: "#40c057" }}>
              Project created
            </div>
            {stat("Name", data.project.name)}
            {stat("ID", data.project.id)}
            {stat("Region", data.project.region)}
            {stat("Tier", data.project.tier)}
          </div>
        );
      }
      return null;
    },
  }),
];
