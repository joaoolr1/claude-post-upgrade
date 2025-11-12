import { AgentApplicationBuilder, MemoryStorage } from '@microsoft/agents-hosting';
import { ActivityTypes } from '@microsoft/agents-activity';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { config } from 'dotenv';
import { 
  ObservabilityManager, 
  InvokeAgentScope, 
  ExecuteToolScope, 
  InferenceScope,
  BaggageBuilder,
  ExecutionType,
  InferenceOperationType
} from '@microsoft/agents-a365-observability';
import runtimePkg from '@microsoft/agents-a365-runtime';
const { getObservabilityAuthenticationScope } = runtimePkg;
import tokenCache from './token-cache.js';

// Load environment variables from .env file FIRST
config();

/**
 * Create a cache key for the agentic token
 */
function createAgenticTokenCacheKey(agentId, tenantId) {
  return tenantId ? `agentic-token-${agentId}-${tenantId}` : `agentic-token-${agentId}`;
}

const SYSTEM_PROMPT = `
You are a Senior Backend TypeScript Architect with deep expertise in server-side development using Bun runtime. You embody the sharp, no-nonsense attitude of a seasoned backend engineer who values clean, maintainable, and well-documented code above all else.

Your core competencies include:
- Advanced TypeScript patterns and best practices for backend systems
- Bun runtime optimization and ecosystem mastery
- RESTful API design and GraphQL implementation
- Database design, optimization, and ORM/query builder usage
- Authentication, authorization, and security best practices
- Microservices architecture and distributed systems
- Performance optimization and scalability patterns
- Error handling, logging, and monitoring strategies
- Testing strategies for backend systems (unit, integration, e2e)

Your development philosophy:
- Write self-documenting code with strategic comments explaining why, not what
- Prioritize type safety and leverage TypeScript advanced features
- Design for maintainability, scalability, and performance from day one
- Follow SOLID principles and clean architecture patterns
- Implement comprehensive error handling and graceful degradation
- Always consider security implications and follow OWASP guidelines
- Write tests that provide confidence and serve as living documentation

When approaching any backend task:
1. Analyze requirements thoroughly and identify potential edge cases
2. Design the solution architecture before writing code
3. Choose appropriate design patterns and data structures
4. Implement with proper error handling and input validation
5. Add comprehensive TypeScript types and interfaces
6. Include strategic comments for complex business logic
7. Consider performance implications and optimization opportunities
8. Suggest testing strategies and provide test examples when relevant

You communicate with the directness of a senior engineer - concise, technically precise, and focused on delivering robust solutions. You proactively identify potential issues, suggest improvements, and explain your architectural decisions. When you encounter ambiguous requirements, you ask pointed questions to clarify the technical specifications needed for optimal implementation.

Always structure your code responses with proper TypeScript typing, clear separation of concerns, and production-ready error handling. Include brief explanations of your architectural choices and any important implementation details that future maintainers should understand.
`;

// Initialize Observability SDK
const observabilitySDK = ObservabilityManager.configure(builder =>
  builder
    .withService('claude-backend-architect-agent', '1.0.0')
    .withTokenResolver(async (agentId, tenantId) => {
      // Token resolver for authentication with Agent365 observability
      console.log('🔑 Token resolver called for agent:', agentId, 'tenant:', tenantId);
      
      // Retrieve the cached agentic token
      const cacheKey = createAgenticTokenCacheKey(agentId, tenantId);
      const cachedToken = tokenCache.get(cacheKey);
      
      if (cachedToken) {
        console.log('🔑 Token retrieved from cache successfully');
        return cachedToken;
      }
      
      console.log('⚠️ No cached token found - token should be cached during agent invocation');
      return null;
    })
    .withClusterCategory(process.env.CLUSTER_CATEGORY)
);

// Start the observability SDK
observabilitySDK.start();

console.log('🔭 Observability SDK initialized');
console.log('🔭 Environment variables:');
console.log('  - ENABLE_OBSERVABILITY:', process.env.ENABLE_OBSERVABILITY);
console.log('  - ENABLE_A365_OBSERVABILITY:', process.env.ENABLE_A365_OBSERVABILITY);
console.log('  - CLUSTER_CATEGORY:', process.env.CLUSTER_CATEGORY);

/**
 * Query the Claude model with observability tracking
 */
async function queryModel(userInput, agentDetails, tenantDetails) {
  const inferenceDetails = {
    operationName: InferenceOperationType.CHAT,
    model: 'claude-sonnet-4-20250514',
    providerName: 'anthropic',
    inputTokens: Math.ceil(userInput.length / 4), // Rough estimate
    outputTokens: 0, // Will be updated after response
    finishReasons: [],
    responseId: `inference-${Date.now()}`
  };

  const inferenceScope = InferenceScope.start(inferenceDetails, agentDetails, tenantDetails);

  try {
    console.log('🧠 Inference Scope created - Model:', inferenceDetails.model);
    console.log('🧠 Estimated input tokens:', inferenceDetails.inputTokens);
    
    // Record input messages for observability
    inferenceScope.recordInputMessages([SYSTEM_PROMPT, userInput]);

    const queryGenerator = query({
      prompt: userInput,
      options: {
        systemPrompt: SYSTEM_PROMPT,
        model: 'claude-sonnet-4-20250514',
        allowedTools: ['WebSearch', 'Bash', 'Read', 'Write', 'Edit', 'Grep', 'Glob'],
      },
    });

    let finalResult = '';
    let toolExecutions = [];

    for await (const message of queryGenerator) {
      if (message.type === 'result' && 'subtype' in message && message.subtype === 'success') {
        finalResult = message.result;
      }
      
      // Track tool executions with observability
      if (message.type === 'tool_use') {
        const toolDetails = {
          toolName: message.name || 'unknown-tool',
          arguments: JSON.stringify(message.input || {}),
          toolCallId: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: `Claude tool execution: ${message.name}`,
          toolType: 'function'
        };

        const toolScope = ExecuteToolScope.start(toolDetails, agentDetails, tenantDetails);
        
        try {
          console.log('🛠️ Tool Scope created for:', message.name);
          console.log('🛠️ Tool arguments:', JSON.stringify(message.input));
          
          // Tool execution is handled by Claude SDK internally
          toolExecutions.push({
            name: message.name,
            input: message.input,
            timestamp: new Date().toISOString()
          });
          
          const response = { 
            tool: message.name,
            executed: true,
            timestamp: new Date().toISOString()
          };
          
          toolScope.recordResponse(JSON.stringify(response));
          console.log('🛠️ Tool execution recorded:', message.name);
        } catch (toolError) {
          console.log('🛠️ Tool execution error:', toolError);
          toolScope.recordError(toolError);
        } finally {
          toolScope.dispose();
        }
      }
    }

    // Record output and update token counts
    if (finalResult) {
      inferenceScope.recordOutputMessages([finalResult]);
      inferenceScope.recordOutputTokens(Math.ceil(finalResult.length / 4)); // Rough estimate
      inferenceScope.recordFinishReasons(['stop']);
    }

    return finalResult;
  } catch (error) {
    inferenceScope.recordError(error);
    console.error('Error querying model:', error);
    return null;
  } finally {
    inferenceScope.dispose();
  }
}

const storage = new MemoryStorage();

// Create the agent application
const app = new AgentApplicationBuilder()
  .withAuthorization({
    agentic: { } // We have the type and scopes set in the .env file
  })
  .withStorage(storage)
  .build();

// Handle incoming messages with observability
app.onActivity(ActivityTypes.Message, async (context) => {
  const userMessage = context.activity.text;

  if (!userMessage) {
    await context.sendActivity('Please send a message.');
    return;
  }

  // Extract context information
  const conversationId = context.activity.conversation?.id || `conv-${Date.now()}`;
  const sessionId = context.activity.channelData?.sessionId || `session-${Date.now()}`;
  const userId = context.activity.from?.id || 'unknown-user';
  const userName = context.activity.from?.name || 'Unknown User';
  const tenantId = context.activity.channelData?.tenant?.id || 'default-tenant';

  // Set up baggage context for distributed tracing
  const baggageScope = new BaggageBuilder()
    .tenantId(tenantId)
    .agentId('claude-backend-architect')
    .correlationId(`corr-${Date.now()}`)
    .agentName('Claude Backend Architect Agent')
    .agentDescription('Senior Backend TypeScript Architect with expertise in server-side development')
    .callerId(userId)
    .callerName(userName)
    .conversationId(conversationId)
    .operationSource('sdk')
    .build();

  // Define agent details for observability
  const agentDetails = {
    agentId: 'claude-backend-architect',
    agentName: 'Claude Backend Architect Agent',
    agentDescription: 'Senior Backend TypeScript Architect with expertise in server-side development using Bun runtime'
  };

  const tenantDetails = {
    tenantId: tenantId
  };

  // Define caller details
  const callerDetails = {
    callerId: userId,
    callerName: userName,
    callerUserId: userId,
    tenantId: tenantId
  };

  // Define invoke details for agent invocation tracking
  const invokeDetails = {
    agentId: agentDetails.agentId,
    agentName: agentDetails.agentName,
    agentDescription: agentDetails.agentDescription,
    conversationId: conversationId,
    sessionId: sessionId,
    endpoint: {
      host: 'localhost',
      port: 3978,
      protocol: 'http'
    },
    request: {
      content: userMessage,
      executionType: ExecutionType.HumanToAgent,
      sessionId: sessionId,
      sourceMetadata: {
        id: 'teams-integration',
        name: 'Microsoft Teams',
        description: 'Microsoft Teams integration channel'
      }
    }
  };

  // Execute within baggage context - using promise-based approach
  try {
    await baggageScope.run(async () => {
      // Start agent invocation scope
      const agentScope = InvokeAgentScope.start(
        invokeDetails,
        tenantDetails,
        null, // No caller agent (human-to-agent interaction)
        callerDetails
      );

      try {
        console.log('\n' + '='.repeat(60));
        console.log('📨 User:', userMessage);
        console.log('🔭 Observability: Tracking agent invocation');
        console.log('🔭 Agent Scope created with ID:', agentDetails.agentId);
        console.log('🔭 Tenant ID:', tenantId);
        console.log('🔭 Conversation ID:', conversationId);
        console.log('='.repeat(60));
        console.log('🤔 Agent is thinking...\n');

        // Exchange and cache the agentic token for observability token resolver
        try {
          const aauToken = await app.authorization.exchangeToken(context, 'agentic', {
            scopes: getObservabilityAuthenticationScope()
          });
          
          const cacheKey = createAgenticTokenCacheKey(agentDetails.agentId, tenantId);
          tokenCache.set(cacheKey, aauToken?.token || '');
          console.log('🔑 Agentic token cached for observability (length:', aauToken?.token?.length ?? 0, ')');
        } catch (tokenError) {
          console.error('⚠️ Failed to exchange/cache agentic token:', tokenError.message);
          // Continue execution - observability may still work with fallback
        }

        // Record input messages for observability
        agentScope.recordInputMessages([userMessage]);

        // Query Claude model with observability
        let modelResponse = await queryModel(userMessage, agentDetails, tenantDetails);

        // Send response back to user
        if (modelResponse) {
          console.log('🤖 Agent:', modelResponse);
          console.log('🔭 Observability: Recording successful response');
          console.log('='.repeat(60) + '\n');
          
          // Record output messages for observability
          agentScope.recordOutputMessages([modelResponse]);
          
          await context.sendActivity(modelResponse);
        } else {
          const errorMessage = 'Sorry, I could not get a response from Claude.';
          agentScope.recordOutputMessages([errorMessage]);
          await context.sendActivity(errorMessage);
        }
      } catch (error) {
        console.error('❌ Error:', error);
        console.error('🔭 Observability: Recording error');
        
        // Record error for observability
        agentScope.recordError(error);
        
        const errorMessage = 'Sorry, something went wrong.';
        agentScope.recordOutputMessages([errorMessage]);
        await context.sendActivity(errorMessage);
      } finally {
        agentScope.dispose();
      }
    });
  } catch (outerError) {
    console.error('❌ Baggage scope error:', outerError);
    await context.sendActivity('Sorry, something went wrong with the observability context.');
  }
});

export { app };
