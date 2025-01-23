import { BasePromptInteractionType } from './base-prompt-interaction';

// AssociateInteraction extends BasePromptInteraction
export interface AssociateInteractionType extends Omit<BasePromptInteractionType, 'dataExtension'> {
  responseIdentifier: string;
  shuffle?: boolean; // Optional, default = false
  maxAssociations?: number; // Optional, default = 1
  minAssociations?: number; // Optional, default = 0
  associableChoices?: Array<{
    value: string;
    matchMax?: number;
  }>;
  dataExtension?: { [key: string]: string };
}