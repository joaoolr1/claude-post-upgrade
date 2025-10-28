import { AgentApplicationBuilder } from '@microsoft/agents-hosting';
import { ActivityTypes } from '@microsoft/agents-activity';
import { InferenceScope, InvokeAgentScope } from '@microsoft/agents-a365-observability';
import { query } from '@anthropic-ai/claude-agent-sdk';

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

const app = new AgentApplicationBuilder().build();

app.onActivity(ActivityTypes.Message, async (context) => {
  const userMessage = context.activity.text;

  const invokeScope = InvokeAgentScope.start({
    agentId: 'claude-backend-architect',
    agentName: 'Claude Backend Architect',
    request: {
      content: userMessage,
      executionType: 'HumanToAgent'
    }
  });

  if (!userMessage) {
    await context.sendActivity('Please send a message.');
    invokeScope?.dispose();
    return;
  }

  try {
    const inferenceScope = InferenceScope.start({
      modelName: 'claude-sonnet-4-20250514',
      provider: 'Anthropic',
      modelVersion: 'claude-sonnet-4-20250514',
      temperature: 0.7,
      maxTokens: 4096,
      prompt: userMessage,
    });

    try {
      const queryGenerator = query({
        prompt: userMessage,
        options: {
          systemPrompt: SYSTEM_PROMPT,
          model: 'claude-sonnet-4-20250514',
          allowedTools: ['WebSearch', 'Bash', 'Read', 'Write', 'Edit', 'Grep', 'Glob'],
        },
      });

      let modelResponse = '';
      for await (const message of queryGenerator) {
        if (message.type === 'result' && 'subtype' in message && message.subtype === 'success') {
          modelResponse = message.result;
        }
      }

      if (modelResponse) {
        await context.sendActivity(modelResponse);
      } else {
        await context.sendActivity('Sorry, I could not get a response from Claude.');
      }

      const content = modelResponse || 'Sorry, I could not get a response from Claude.';

      inferenceScope?.recordResponse({
        content: content,
        responseId: `resp-${Date.now()}`,
        finishReason: 'stop',
        inputTokens: 100,
        outputTokens: 200,
        totalTokens: 300,
      });

      invokeScope?.recordResponse(content);

    } catch (error) {
      console.error('Error:', error);
      inferenceScope?.recordError(error);
      await context.sendActivity('Sorry, something went wrong.');
    } finally {
      inferenceScope?.dispose();
    }

  } catch (error) {
    console.error('Error:', error);
    invokeScope?.recordError(error);
    await context.sendActivity('Sorry, something went wrong.');
  } finally {
    invokeScope?.dispose();
  }
});

export { app };
