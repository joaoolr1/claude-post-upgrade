# Side-by-Side Comparison: Before and After Upgrade

## File Structure Comparison

### Before (claude-pre-upgrade/)
```
claude-pre-upgrade/
├── .env.example
├── agent.ts          (single file with all logic)
├── package.json
├── tsconfig.json
└── README.md
```

### After (claude-post-upgrade/)
```
claude-post-upgrade/
├── .env
├── .env.example
├── manifest.json                      [NEW - Teams app manifest]
├── agenticUserTemplateManifest.json   [NEW - Agent template]
├── package.json
├── README.md
├── UPGRADE-SUMMARY.md
└── src/
    ├── agent.js                       [NEW - Activity Protocol logic]
    └── index.js                       [NEW - Express server]
```

## Code Comparison

### Entry Point

**Before (agent.ts):**
```typescript
async function main() {
  const userInput = process.argv[2] || 'Hello, how can you help me?';
  console.log('User:', userInput);
  console.log('\nAgent is thinking...\n');
  
  const queryGenerator = query({
    prompt: userInput,
    options: { systemPrompt: SYSTEM_PROMPT, model: 'claude-sonnet-4-20250514', ... }
  });
  
  for await (const message of queryGenerator) {
    if (message.type === 'result' && message.subtype === 'success') {
      finalResult = message.result;
    }
  }
  
  console.log('Agent:', finalResult);
}

main().catch(console.error);
```

**After (src/index.js):**
```javascript
import express from 'express';
import { startServer } from '@microsoft/agents-hosting-express';
import { app } from './agent.js';

const server = await startServer(app);
server.use(express.json());
console.log('✅ Agent server is running on http://localhost:3978');
```

### Agent Logic

**Before (agent.ts):**
```typescript
// Standalone function, CLI-based
async function main() {
  const userInput = process.argv[2];
  // ... query logic
}
```

**After (src/agent.js):**
```javascript
// Activity Protocol message handler
const app = new AgentApplicationBuilder().build();

app.onActivity(ActivityTypes.Message, async (context) => {
  const userMessage = context.activity.text;
  
  if (!userMessage) {
    await context.sendActivity('Please send a message.');
    return;
  }
  
  try {
    // Same Claude SDK query logic preserved
    const queryGenerator = query({
      prompt: userMessage,
      options: { systemPrompt: SYSTEM_PROMPT, ... }
    });
    
    // Same streaming logic
    let modelResponse = '';
    for await (const message of queryGenerator) {
      if (message.type === 'result' && message.subtype === 'success') {
        modelResponse = message.result;
      }
    }
    
    // Activity Protocol response instead of console.log
    await context.sendActivity(modelResponse || 'Sorry, I could not get a response from Claude.');
  } catch (error) {
    console.error('Error:', error);
    await context.sendActivity('Sorry, something went wrong.');
  }
});

export { app };
```

## Package Dependencies Comparison

### Before
```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.10",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "@types/node": "^24.7.0",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  }
}
```

### After
```json
{
  "dependencies": {
    "@microsoft/agents-hosting-express": "^1.0.15",    [NEW]
    "@microsoft/agents-hosting": "^1.0.15",            [NEW]
    "@microsoft/agents-activity": "^1.0.15",           [NEW]
    "express": "^4.18.0",                              [NEW]
    "@anthropic-ai/claude-agent-sdk": "^0.1.10",       [PRESERVED]
    "dotenv": "^17.2.3"                                [PRESERVED]
  },
  "devDependencies": {
    "@microsoft/m365agentsplayground": "^0.2.19",      [NEW]
    "@types/node": "^24.7.0",
    "typescript": "^5.9.3"
  }
}
```

## Runtime Comparison

### Before
```bash
# Run with TypeScript via tsx
npm start "Your message here"

# Runs: tsx agent.ts
```

### After
```bash
# Terminal 1: Start server
npm run dev

# Runs: node --env-file .env --watch src/index.js
# Server listens on http://localhost:3978

# Terminal 2: Test with playground
npm run test-tool

# Runs: agentsplayground
```

## Communication Protocol Comparison

### Before: CLI-based
```
User types → CLI argument → Agent processes → Console output
```

### After: Activity Protocol
```
HTTP Request → Activity Protocol Message → Agent processes → Activity Response → HTTP Response
```

## What Stayed the Same ✅

1. **Complete System Prompt** - The entire "Senior Backend TypeScript Architect" prompt is preserved
2. **Claude SDK Integration** - Still using `@anthropic-ai/claude-agent-sdk` for model queries
3. **Model Configuration** - Same model (`claude-sonnet-4-20250514`) and tools
4. **Streaming Logic** - Same async generator iteration pattern
5. **Error Handling** - Same try-catch structure

## What Changed 🔄

1. **Input Method**: CLI arguments → Activity Protocol messages
2. **Output Method**: `console.log` → `context.sendActivity()`
3. **Runtime**: TypeScript with `tsx` → JavaScript with Node.js
4. **Server**: None → Express server on port 3978
5. **Testing**: CLI → M365 Agents Playground
6. **Configuration**: dotenv file loading → `--env-file` flag
7. **Architecture**: Single-file script → Multi-file server application

## Key Insight

The upgrade **wraps** the original Claude SDK logic with Agent365 SDK's Activity Protocol, enabling the agent to work within Microsoft's agent ecosystem while preserving the core AI interaction logic.
