import { Agent, createToolHelper } from '@kapaai/agent-core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { z } from 'zod';

const PROJECT_ID = import.meta.env.VITE_AGENT_PROJECT_ID;
const INTEGRATION_ID = import.meta.env.VITE_AGENT_INTEGRATION_ID;
const AGENT_MODEL = import.meta.env.VITE_AGENT_MODEL;
const SESSION_SERVER = import.meta.env.VITE_SESSION_SERVER_URL;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const tool = createToolHelper();

const MOCK_PROJECTS = [
  { id: 'proj-1', name: 'Acme Web App', status: 'active', members: 8, lastActivity: '2 hours ago' },
  { id: 'proj-2', name: 'Mobile API', status: 'active', members: 4, lastActivity: '15 minutes ago' },
  { id: 'proj-3', name: 'Internal Tools', status: 'paused', members: 2, lastActivity: '3 days ago' },
  { id: 'proj-4', name: 'Data Pipeline v2', status: 'active', members: 5, lastActivity: '1 hour ago' },
];

const MOCK_PROJECT_DETAILS = {
  'proj-1': {
    id: 'proj-1', name: 'Acme Web App', status: 'active', createdAt: '2025-09-12',
    members: [
      { name: 'Alice Chen', role: 'owner', email: 'alice@acme.io' },
      { name: 'Bob Martinez', role: 'admin', email: 'bob@acme.io' },
    ],
    settings: { region: 'us-east-1', tier: 'pro', autoScaling: true },
    usage: { apiCalls: 145230, storage: '2.3 GB', bandwidth: '12.1 GB' },
  },
  'proj-2': {
    id: 'proj-2', name: 'Mobile API', status: 'active', createdAt: '2026-01-05',
    members: [
      { name: 'Alice Chen', role: 'owner', email: 'alice@acme.io' },
      { name: 'Dave Park', role: 'member', email: 'dave@acme.io' },
    ],
    settings: { region: 'eu-west-1', tier: 'starter', autoScaling: false },
    usage: { apiCalls: 32100, storage: '450 MB', bandwidth: '3.2 GB' },
  },
};

const tools = [
  tool({
    name: 'list_projects',
    description: 'List all projects for the current user with their status and recent activity',
    parameters: z.object({}),
    displayName: 'List Projects',
    execute: async () => {
      await delay(400);
      return MOCK_PROJECTS;
    },
  }),
  tool({
    name: 'get_project_details',
    description: 'Get detailed information about a specific project including members, settings, and usage',
    parameters: z.object({
      project_id: z.string().describe('The project ID (e.g. proj-1)'),
    }),
    displayName: 'Project Details',
    execute: async ({ project_id }) => {
      await delay(600);
      const project = MOCK_PROJECT_DETAILS[project_id];
      if (!project) return { error: `Project ${project_id} not found` };
      return project;
    },
  }),
  tool({
    name: 'get_usage_stats',
    description: 'Get API usage statistics for the current billing period including API calls, storage, and bandwidth',
    parameters: z.object({}),
    displayName: 'Usage Stats',
    execute: async () => {
      await delay(500);
      return {
        plan: 'Pro', billingPeriod: 'Mar 1 – Mar 31, 2026',
        apiCalls: { used: 245800, limit: 500000 },
        storage: { used: 4.8, limit: 10, unit: 'GB' },
        bandwidth: { used: 28.3, limit: 50, unit: 'GB' },
        teamMembers: { used: 12, limit: 25 },
      };
    },
  }),
  tool({
    name: 'invite_team_member',
    description: 'Invite a new team member to a project by email',
    parameters: z.object({
      project_id: z.string().describe('The project ID'),
      email: z.string().describe('Email address of the person to invite'),
      role: z.enum(['admin', 'member', 'viewer']).describe('Role to assign'),
    }),
    displayName: 'Invite Team Member',
    needsApproval: true,
    execute: async ({ project_id, email, role }) => {
      await delay(800);
      return { success: true, message: `Invitation sent to ${email} as ${role} on project ${project_id}` };
    },
  }),
  tool({
    name: 'create_project',
    description: 'Create a new project with the given name, region, and tier',
    parameters: z.object({
      name: z.string().describe('Project name'),
      region: z.enum(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']).describe('Deployment region'),
      tier: z.enum(['starter', 'pro', 'enterprise']).describe('Pricing tier'),
    }),
    displayName: 'Create Project',
    needsApproval: true,
    execute: async ({ name, region, tier }) => {
      await delay(1000);
      return {
        success: true,
        project: { id: `proj-${Date.now()}`, name, region, tier, status: 'active', createdAt: new Date().toISOString() },
      };
    },
  }),
];

const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');
const stopBtn = document.getElementById('stop-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const streamingIndicator = document.getElementById('streaming-indicator');

const agent = new Agent({
  projectId: PROJECT_ID,
  integrationId: INTEGRATION_ID,
  model: AGENT_MODEL,
  tools,
  getSessionToken: async () => {
    const res = await fetch(`${SESSION_SERVER}/api/session`, { method: 'POST' });
    if (!res.ok) throw new Error(`Session failed: ${res.status}`);
    return res.json();
  },
  onMessagesChange: renderMessages,
  onStreamingChange: (streaming) => {
    streamingIndicator.style.display = streaming ? 'block' : 'none';
    sendBtn.style.display = streaming ? 'none' : 'block';
    stopBtn.style.display = streaming ? 'block' : 'none';
    inputEl.disabled = streaming;
  },
});

function renderMessage(msg) {
  if (msg.role === 'user') {
    const el = document.createElement('div');
    el.className = 'msg-user';
    el.textContent = msg.content;
    return el;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'msg-assistant';

  if (msg.isError) {
    wrapper.className = 'msg-error';
    wrapper.textContent = msg.content;
    return wrapper;
  }

  for (const block of msg.blocks) {
    if (block.type === 'text' && block.content) {
      const textEl = document.createElement('div');
      textEl.className = 'markdown';
      textEl.innerHTML = DOMPurify.sanitize(marked.parse(block.content));
      wrapper.appendChild(textEl);
    }

    if (block.type === 'tool_calls') {
      for (const tc of block.toolCalls) {
        wrapper.appendChild(renderToolCall(tc));
      }
    }
  }

  return wrapper;
}

function renderMessages(messages) {
  const existingCount = messagesEl.children.length;

  // Re-render the last message (it may still be streaming)
  if (existingCount > 0 && existingCount <= messages.length) {
    const lastEl = messagesEl.children[existingCount - 1];
    lastEl.replaceWith(renderMessage(messages[existingCount - 1]));
  }

  // Append any new messages
  for (let i = existingCount; i < messages.length; i++) {
    messagesEl.appendChild(renderMessage(messages[i]));
  }

  // Handle reset (messages array shorter than DOM)
  while (messagesEl.children.length > messages.length) {
    messagesEl.lastChild.remove();
  }

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderToolCall(tc) {
  const card = document.createElement('div');
  card.className = 'tool-card';

  const header = document.createElement('div');
  header.className = 'tool-header';
  const nameSpan = document.createElement('span');
  nameSpan.textContent = tc.displayName || tc.name;
  const statusSpan = document.createElement('span');
  statusSpan.className = 'tool-status';
  statusSpan.textContent = tc.status + (tc.durationMs ? ` · ${tc.durationMs}ms` : '');
  header.appendChild(nameSpan);
  header.appendChild(statusSpan);
  card.appendChild(header);

  if (tc.status === 'approval_requested') {
    const buttons = document.createElement('div');
    buttons.className = 'approval-buttons';

    const allowBtn = document.createElement('button');
    allowBtn.className = 'btn-allow';
    allowBtn.textContent = 'Allow';
    allowBtn.onclick = () => agent.approveToolCall(tc.id);

    const denyBtn = document.createElement('button');
    denyBtn.className = 'btn-deny';
    denyBtn.textContent = 'Deny';
    denyBtn.onclick = () => agent.rejectToolCall(tc.id);

    buttons.appendChild(allowBtn);
    buttons.appendChild(denyBtn);
    card.appendChild(buttons);
  }

  if (tc.result !== undefined) {
    const body = document.createElement('div');
    body.className = 'tool-body';
    body.textContent = typeof tc.result === 'string'
      ? tc.result
      : JSON.stringify(tc.result, null, 2);
    card.appendChild(body);
  }

  if (tc.sources && tc.sources.length > 0) {
    const sourcesEl = document.createElement('div');
    sourcesEl.className = 'tool-body';
    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px';
    label.textContent = 'Sources';
    sourcesEl.appendChild(label);
    for (const s of tc.sources) {
      const link = document.createElement('a');
      link.href = s.sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.cssText = 'display:block;font-size:12px;color:#888;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      link.textContent = s.title || s.sourceUrl;
      sourcesEl.appendChild(link);
    }
    card.appendChild(sourcesEl);
  }

  if (tc.error) {
    const errEl = document.createElement('div');
    errEl.className = 'tool-body';
    errEl.style.color = '#ff6b6b';
    errEl.textContent = tc.error;
    card.appendChild(errEl);
  }

  return card;
}

function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = '';
  agent.sendMessage(text).catch((err) => console.error('Send failed:', err));
}

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

sendBtn.addEventListener('click', handleSend);
stopBtn.addEventListener('click', () => agent.stopGeneration());
newChatBtn.addEventListener('click', () => agent.resetConversation());
