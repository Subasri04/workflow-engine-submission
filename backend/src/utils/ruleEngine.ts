import Rule from "../models/rule.model";

export interface RuleEvaluationLog {
  rule: string;
  priority: number;
  result: boolean;
  error?: string;
  is_default?: boolean;
}

export interface RuleEngineResult {
  nextStepId: string | null;
  logs: RuleEvaluationLog[];
  matchedRuleId?: string;
  usedDefault?: boolean;
}

export async function evaluateRules(
  stepId: string,
  data: Record<string, unknown>
): Promise<RuleEngineResult> {
  const rules = await Rule.find({ step_id: stepId }).sort({ priority: 1 });

  const logs: RuleEvaluationLog[] = [];

  let defaultRule: any = null;

  for (const rule of rules) {
    if (rule.condition.trim().toUpperCase() === "DEFAULT") {
      defaultRule = rule;
      continue;
    }

    try {
      const fn = new Function(
        "data",
        `
        with(data) {
          return (${rule.condition});
        }
      `
      );

      const result = Boolean(fn(data));

      logs.push({
        rule: rule.condition,
        priority: rule.priority,
        result
      });

      if (result) {
        return {
          nextStepId: rule.next_step_id
            ? rule.next_step_id.toString()
            : null,
          logs,
          matchedRuleId: rule._id.toString(),
          usedDefault: false
        };
      }
    } catch (error) {
      logs.push({
        rule: rule.condition,
        priority: rule.priority,
        result: false,
        error: (error as Error).message
      });
    }
  }

  if (defaultRule) {
    logs.push({
      rule: "DEFAULT",
      priority: defaultRule.priority,
      result: true,
      is_default: true
    });

    return {
      nextStepId: defaultRule.next_step_id ?? null,
      logs,
      matchedRuleId: defaultRule._id.toString(),
      usedDefault: true
    };
  }

  return {
    nextStepId: null,
    logs,
    usedDefault: false
  };
}
