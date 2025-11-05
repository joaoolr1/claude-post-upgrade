# Claude Backend Architect Agent

A sophisticated AI agent powered by Anthropic's Claude Sonnet 4, built with Microsoft's Agent365 SDK. This agent specializes in backend TypeScript architecture and development, providing expert guidance on server-side systems, API design, database optimization, and production-ready code patterns.

## 🎯 Features

- **Expert Backend Architecture**: Senior-level TypeScript/Bun runtime expertise
- **Agent365 Integration**: Built on Microsoft's Agent365 SDK with Activity Protocol
- **Full Observability**: Integrated telemetry with InvokeAgentScope and InferenceScope
- **Claude Sonnet 4**: Powered by Anthropic's latest model with extended context
- **Tool Integration**: WebSearch, Bash, file operations (Read, Write, Edit, Grep, Glob)
- **Production Ready**: Comprehensive error handling and logging

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- Anthropic API key
- Azure Monitor connection string (optional, for observability)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/joaoolr1/claude-post-upgrade.git
   cd claude-post-upgrade
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your keys:
   # ANTHROPIC_API_KEY=your_anthropic_key
   # AZURE_MONITOR_CONNECTION_STRING=your_azure_monitor_connection
   # AGENT_BLUEPRINT_ID=a-unique-guid
   ```

### Running the Agent

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The agent will start on **http://localhost:3978**

### Testing with M365 Agents Playground

Open a separate terminal and run:
```bash
npm run test-tool
```

This launches the Microsoft 365 Agents Playground, providing an interactive UI to test your agent locally.

## 📁 Project Structure

```
claude-post-upgrade/
├── src/
│   ├── index.js              # Server entry point
│   └── agent.js              # Agent logic and message handlers
├── manifest.json             # Teams app manifest
├── agenticUserTemplateManifest.json  # Agent template definition
├── package.json              # Dependencies and scripts
├── .env                      # Environment configuration (not committed)
└── web.config                # Azure deployment configuration
```

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js 22.x with ES Modules
- **Agent Framework**: Microsoft Agent365 SDK v1.0.15
- **AI Model**: Anthropic Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Server**: Express.js via `@microsoft/agents-hosting-express`
- **Observability**: Agent365 Observability SDK with Azure Monitor

### Key Components

#### 1. Agent Application (`src/agent.js`)
- Built using `AgentApplicationBuilder`
- Handles `ActivityTypes.Message` events
- Integrates Claude SDK with streaming responses
- Implements observability scopes for telemetry

#### 2. Server (`src/index.js`)
- Express server managed by Agent365 SDK
- Activity Protocol endpoint at `/api/messages`
- Authentication disabled for local testing (configurable for production)

#### 3. System Prompt
The agent embodies a **Senior Backend TypeScript Architect** with expertise in:
- Advanced TypeScript patterns
- Bun runtime optimization
- RESTful/GraphQL API design
- Database design and optimization
- Microservices architecture
- Security best practices (OWASP guidelines)
- Comprehensive testing strategies

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ Yes |
| `AZURE_MONITOR_CONNECTION_STRING` | Azure Monitor for telemetry | ⚠️ Optional |
| `AGENT_BLUEPRINT_ID` | Unique identifier for agent | ⚠️ Optional |
| `PORT` | Server port (default: 3978) | ❌ No |

### Authentication

For **local development**, authentication is disabled by default:
```javascript
startServer(app, {});
```

For **production deployment**, enable Bot Framework authentication:
```javascript
const authConfig = {
  MicrosoftAppId: process.env.MICROSOFT_APP_ID,
  MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
  MicrosoftAppType: 'MultiTenant'
};
startServer(app, authConfig);
```

## 🌐 Deployment

### Azure Web App

The project includes a GitHub Actions workflow (`.github/workflows/main_backend-architect-agent.yml`) for automated deployment to Azure Web Apps.

**Prerequisites:**
- Azure Web App resource
- Azure Bot Service registration (for production)
- GitHub repository secrets configured

**Deployment Steps:**
1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Configure environment variables in Azure Portal
4. Restart the Web App to apply changes

**Azure Configuration:**
- Set `ANTHROPIC_API_KEY` in App Settings
- Set `MicrosoftAppId` and `MicrosoftAppPassword` (if using authentication)
- Ensure `web.config` is deployed for IIS routing

### Local Testing with Playground

The Agent365 Playground provides a local testing environment that simulates the Bot Framework:

```bash
# Terminal 1: Start the agent
npm run dev

# Terminal 2: Launch playground
npm run test-tool
```

Access the playground at `http://localhost:56150` (port may vary)

## 📊 Observability

The agent includes full telemetry integration:

### InvokeAgentScope
Tracks agent invocation metrics:
- Request/response content
- Execution type (HumanToAgent)
- Agent metadata (ID, name)

### InferenceScope
Tracks AI model inference:
- Model name and version
- Temperature and token limits
- Input/output token counts
- Response metadata

Telemetry is sent to Azure Monitor when `AZURE_MONITOR_CONNECTION_STRING` is configured.

## 🛠️ Development

### Available Scripts

- `npm start` - Run the agent in production mode
- `npm run dev` - Run with auto-reload and environment file loading
- `npm run test-tool` - Launch M365 Agents Playground

### Adding New Features

1. **Modify the system prompt** in `src/agent.js` to change agent behavior
2. **Add new activity handlers** using `app.onActivity(ActivityType, handler)`
3. **Update observability** by adjusting InferenceScope and InvokeAgentScope parameters

### Claude SDK Tools

The agent has access to these tools:
- `WebSearch` - Search the web for information
- `Bash` - Execute bash commands
- `Read` - Read file contents
- `Write` - Create or overwrite files
- `Edit` - Edit existing files
- `Grep` - Search within files
- `Glob` - Find files matching patterns

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Agent won't start
- Verify `ANTHROPIC_API_KEY` is set in `.env`
- Check Node.js version is 22.x or higher
- Ensure port 3978 is not in use

### Playground connection fails
- Ensure agent is running on port 3978
- Try restarting both agent and playground
- Check firewall settings for localhost

### Azure deployment errors
- Verify all environment variables are set in Azure Portal
- Check GitHub Actions logs for build errors
- Ensure `web.config` is present for IIS routing
- Review Azure Web App logs for runtime errors

## 📚 Resources

- [Agent365 SDK Documentation](https://aka.ms/agents365)
- [Anthropic Claude Documentation](https://docs.anthropic.com)
- [Bot Framework Activity Protocol](https://docs.microsoft.com/en-us/azure/bot-service)
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor)

---

**Built with** ❤️ **using Microsoft Agent365 SDK and Anthropic Claude**
