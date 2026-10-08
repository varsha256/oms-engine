import { createMachine, createActor } from 'xstate';
import { Engine } from 'json-rules-engine';

export async function evaluateStateTransition(
  workflowConfig: any,
  currentState: string,
  event: string,
  contextFacts: Record<string, any>
) {
  const stateDef = workflowConfig.states[currentState];
  if (!stateDef || !stateDef.on || !stateDef.on[event]) {
    throw new Error(`INVALID_TRANSITION: Event '${event}' not allowed from state '${currentState}'.`);
  }

  const transition = stateDef.on[event];

  // Evaluate Guard Rules if defined
  if (transition.guard) {
    const ruleEngine = new Engine();
    ruleEngine.addRule({
      conditions: transition.guard.conditions,
      event: { type: 'GUARD_MATCH' }
    });

    const { events } = await ruleEngine.run(contextFacts);
    if (events.length === 0) {
      throw new Error(`GUARD_FAILED: Guard conditions failed for transition '${event}'.`);
    }
  }

  return transition.target; // Target state string
}