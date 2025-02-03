import * as React from 'react';
import { QtiItem, QtiResponse, QtiOutcome } from './qti';

export interface ProcessingContext {
  item: QtiItem;
  responses: Record<string, QtiResponse>;
  outcomes: Record<string, QtiOutcome>;
  onOutcomeChange: (identifier: string, value: any) => void;
}

export interface ProcessingRule {
  type: string;
  identifier: string;
  value?: any;
  condition?: string;
  rules?: ProcessingRule[];
}

export const useQtiProcessing = (context: ProcessingContext) => {
  const { item, responses, outcomes, onOutcomeChange } = context;

  const processResponseRules = React.useCallback((rules: ProcessingRule[]) => {
    rules.forEach(rule => {
      switch (rule.type) {
        case 'exitResponse':
          return; // Exit processing

        case 'setOutcomeValue':
          if (rule.identifier && rule.value !== undefined) {
            onOutcomeChange(rule.identifier, rule.value);
          }
          break;

        case 'lookupOutcomeValue':
          if (rule.identifier) {
            const response = responses[rule.identifier];
            if (response) {
              onOutcomeChange(rule.identifier, response.value);
            }
          }
          break;

        case 'match':
          if (rule.identifier && responses[rule.identifier]) {
            const response = responses[rule.identifier];
            const isMatch = response.value === response.correctResponse;
            if (rule.rules && isMatch) {
              processResponseRules(rule.rules);
            }
          }
          break;

        case 'responseCondition':
          if (rule.condition && rule.rules) {
            const conditionMet = evaluateCondition(rule.condition, responses);
            if (conditionMet) {
              processResponseRules(rule.rules);
            }
          }
          break;

        case 'responseProcessing':
          if (rule.rules) {
            processResponseRules(rule.rules);
          }
          break;
      }
    });
  }, [responses, onOutcomeChange]);

  const evaluateCondition = (condition: string, responses: Record<string, QtiResponse>): boolean => {
    // Simple condition evaluation - can be expanded based on needs
    const [identifier, value] = condition.split('=');
    const response = responses[identifier.trim()];
    return response?.value === value.trim();
  };

  const processResponses = React.useCallback(() => {
    if (item.adaptive) {
      // Process adaptive rules
      Object.entries(responses).forEach(([identifier, response]) => {
        if (response.value !== undefined) {
          const isCorrect = response.value === response.correctResponse;
          onOutcomeChange(`${identifier}.isCorrect`, isCorrect);
        }
      });
    }

    // Process standard response rules
    if (item.responseRules) {
      processResponseRules(item.responseRules);
    }
  }, [item, responses, processResponseRules]);

  return {
    processResponses,
    processResponseRules
  };
};

export default useQtiProcessing;