# Setup Checklist for Upgraded Agent

Use this checklist to verify your agent upgrade is complete and ready to run.

## ✅ Pre-Flight Checklist

### 1. Files Created
- [ ] `manifest.json` exists in project root
- [ ] `agenticUserTemplateManifest.json` exists in project root
- [ ] `src/agent.js` exists with Activity Protocol handler
- [ ] `src/index.js` exists with Express server setup
- [ ] `package.json` has all required dependencies
- [ ] `.env` file exists with configuration
- [ ] `README.md` has usage instructions

### 2. Dependencies Installed
- [ ] Ran `npm install` successfully
- [ ] `node_modules/` folder exists
- [ ] Package `@microsoft/agents-hosting-express` installed
- [ ] Package `@microsoft/agents-hosting` installed
- [ ] Package `@microsoft/agents-activity` installed
- [ ] Package `@anthropic-ai/claude-agent-sdk` installed
- [ ] Package `@microsoft/m365agentsplayground` installed (dev)

### 3. Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `ANTHROPIC_API_KEY` is set with valid API key
- [ ] `AGENT_BLUEPRINT_ID` is set with a GUID (use `New-Guid` in PowerShell or online generator)
- [ ] `AZURE_MONITOR_CONNECTION_STRING` is present (optional for now)

Example GUID generation (PowerShell):
```powershell
New-Guid
```

### 4. Code Verification
- [ ] `src/agent.js` imports `AgentApplicationBuilder`
- [ ] `src/agent.js` imports `ActivityTypes`
- [ ] `src/agent.js` has `app.onActivity(ActivityTypes.Message, ...)` handler
- [ ] `src/agent.js` exports `app`
- [ ] `src/index.js` imports `startServer`
- [ ] `src/index.js` imports `app` from `./agent.js`
- [ ] Original `SYSTEM_PROMPT` is preserved in `src/agent.js`
- [ ] Claude SDK `query()` logic is preserved

### 5. Manifest Files
- [ ] `manifest.json` has `${AGENT_BLUEPRINT_ID}` placeholder
- [ ] `agenticUserTemplateManifest.json` has `${AGENT_BLUEPRINT_ID}` placeholder
- [ ] Both manifests reference same blueprint ID
- [ ] Manifest has correct schema URLs

### 6. Package Scripts
- [ ] `package.json` has `"start": "node src/index.js"`
- [ ] `package.json` has `"dev": "node --env-file .env --watch src/index.js"`
- [ ] `package.json` has `"test-tool": "agentsplayground"`
- [ ] `package.json` has `"type": "module"`

### 7. No Errors
- [ ] No syntax errors in `src/agent.js`
- [ ] No syntax errors in `src/index.js`
- [ ] No import errors
- [ ] No TypeScript errors (if any .ts files)

## 🚀 Testing Checklist

### Test 1: Server Starts
```bash
npm run dev
```

Expected output:
```
🚀 Starting Claude Backend Architect Agent
   http://localhost:3978

✅ Agent server is running and ready to accept connections
```

- [ ] Server starts without errors
- [ ] Port 3978 is accessible
- [ ] No import/module errors
- [ ] Process stays running

### Test 2: Playground Connects
In a separate terminal:
```bash
npm run test-tool
```

- [ ] Playground tool launches
- [ ] Can connect to agent
- [ ] No connection errors

### Test 3: Agent Responds
Send a test message through the playground:
```
"Hello, introduce yourself"
```

- [ ] Agent receives message
- [ ] Agent sends response
- [ ] Response matches agent persona (Senior Backend TypeScript Architect)
- [ ] No errors in server logs

### Test 4: Claude SDK Works
Send a complex query:
```
"Explain the benefits of TypeScript's advanced type system"
```

- [ ] Agent queries Claude successfully
- [ ] Receives streaming response
- [ ] Returns complete answer
- [ ] Response is technically accurate

## 🔍 Troubleshooting

### Server won't start
- Check `.env` file exists and is in the project root
- Verify `ANTHROPIC_API_KEY` is set
- Check no other service is using port 3978
- Run `npm install` again

### Playground can't connect
- Verify server is running (`npm run dev`)
- Check server shows "ready to accept connections"
- Ensure playground is pointing to http://localhost:3978
- Check firewall settings

### Agent returns errors
- Check Anthropic API key is valid
- Verify API key has proper permissions
- Check internet connectivity
- Review server console for detailed error messages

### Import errors
- Verify `"type": "module"` is in `package.json`
- Check all imports use `.js` extension (not `.ts`)
- Ensure file paths are correct
- Run `npm install` to reinstall dependencies

## 📝 Optional Enhancements

### Add Observability (when packages available)
- [ ] Install `@microsoft/kairo-sdk-observability`
- [ ] Install `@azure/monitor-opentelemetry-exporter`
- [ ] Create `src/telemetry.js`
- [ ] Add `InvokeAgentScope` to activity handler
- [ ] Add `InferenceScope` to model queries
- [ ] Configure Azure Monitor connection string

### Custom Configuration
- [ ] Update agent name in `manifest.json`
- [ ] Update agent description
- [ ] Customize system prompt in `src/agent.js`
- [ ] Add additional tools to Claude SDK options
- [ ] Adjust model parameters (temperature, max tokens)

## ✅ Final Verification

All systems operational when:
1. ✅ Server starts without errors
2. ✅ Playground connects successfully
3. ✅ Agent responds to messages
4. ✅ Claude SDK queries work
5. ✅ No console errors

**Status**: Ready for development and testing! 🎉
