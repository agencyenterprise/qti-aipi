// assessment-item.ts
import { BaseType, Cardinality, CommonAttributes, ResponseDeclaration, ModalFeedback, TimeLimits } from './qti-types';
import { ItemBody } from './item-body';

/**
 * Outcome declaration for assessment items
 * @qti Defines variables computed during response processing
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.outcomeDeclaration
 */
export interface OutcomeDeclaration {
  /**
   * The unique identifier for this outcome
   * @qti Required. Must be unique within the item
   */
  identifier: string;

  /**
   * The cardinality of the outcome
   * @qti Required. Defines how many values can be stored
   */
  cardinality: Cardinality;

  /**
   * The base type of the outcome
   * @qti Required. Defines the type of values that can be stored
   */
  baseType: BaseType;

  /**
   * The default value for this outcome
   * @qti Optional. Initial value of the outcome
   */
  defaultValue?: string | number | boolean | string[] | number[] | boolean[];

  /**
   * The lookup table for this outcome
   * @qti Optional. Maps input values to output values
   */
  lookupTable?: {
    defaultValue?: number;
    entries: {
      sourceValue: number;
      targetValue: number;
    }[];
  };
}

/**
 * Template declaration for an assessment item
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.1t3h5sf
 */
export interface TemplateDeclaration {
  /**
   * The unique identifier for this template variable
   * @qti required
   */
  identifier: string;

  /**
   * The cardinality of the template variable
   * @qti required
   */
  cardinality: Cardinality;

  /**
   * The base type of the template variable
   * @qti required
   */
  baseType: BaseType;

  /**
   * Whether this is a parameter variable
   * @qti optional
   */
  paramVariable?: boolean;

  /**
   * Whether this is a math variable
   * @qti optional
   */
  mathVariable?: boolean;
}

/**
 * Template processing rules for an assessment item
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.4d34og8
 */
export interface TemplateProcessing {
  /**
   * The template rules to be processed
   * @qti Required. Rules for processing template variables
   */
  templateRules: {
    type: 'setTemplateValue' | 'setDefaultValue' | 'setCorrectResponse' | 'templateCondition';
    expression?: string;
    identifier?: string;
    value?: string;
  }[];
}

/**
 * End attempt interaction
 * @qti Allows candidates to end the current attempt
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.endAttemptInteraction
 */
export interface EndAttemptInteraction {
  /**
   * Response identifier for this interaction
   * @qti required
   */
  responseIdentifier: string;

  /**
   * Title for the end attempt control
   * @qti optional
   */
  title?: string;
}

/**
 * Response rule for response processing
 * @qti Defines a single response processing rule
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.responseRule
 */
export interface ResponseRule {
  /**
   * Type of rule
   * @qti required
   */
  type: 
    | 'setOutcomeValue'
    | 'lookupOutcomeValue' 
    | 'matchResponse'
    | 'responseCondition'
    | 'responseIf'
    | 'responseElseIf'
    | 'responseElse';

  /**
   * Expression to evaluate
   * @qti required for some rule types
   */
  expression?: string;

  /**
   * Identifier of variable to set
   * @qti required for setOutcomeValue
   */
  identifier?: string;

  /**
   * Value to set
   * @qti required for setOutcomeValue
   */
  value?: string | number | boolean | string[] | number[] | boolean[];

  /**
   * Child rules for conditions
   * @qti required for conditions
   */
  childRules?: ResponseRule[];
}

/**
 * Response processing rules for an assessment item
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.2s8eyo1
 */
export interface ResponseProcessing {
  /**
   * The URI of the response processing template to use
   * @qti optional
   */
  template?: string;

  /**
   * The response processing rules
   * @qti optional
   */
  responseRules?: ResponseRule[];
}

/**
 * Represents a QTI 3.0 Stylesheet
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.26in1rg
 */
export interface Stylesheet {
  /**
   * URI of the stylesheet
   * @qti Required. Location of the stylesheet
   */
  href: string;

  /**
   * MIME type of the stylesheet
   * @qti Required. Usually 'text/css'
   */
  type: string;

  /**
   * Media type for the stylesheet
   * @qti Optional. CSS media query
   */
  media?: string;

  /**
   * Title of the stylesheet
   * @qti Optional
   */
  title?: string;
}

/**
 * Assessment item structure
 * @qti The root element for a QTI assessment item
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.assessmentItem
 */
export interface AssessmentItem extends CommonAttributes {
  /**
   * Whether the item adapts itself to the responses given by the candidate
   * @qti required
   */
  adaptive: boolean;

  /**
   * Whether the item's scoring is sensitive to the time taken to complete the item
   * @qti required
   */
  timeDependent: boolean;

  /**
   * A normalized string identifier for the item
   * @qti optional. Must be a valid xs:normalizedString
   */
  stringIdentifier?: string;

  /**
   * The name of the tool used to create the item
   * @qti optional
   */
  toolName?: string;

  /**
   * The version of the tool used to create the item
   * @qti optional
   */
  toolVersion?: string;

  /**
   * Response declarations for the item
   * @qti optional, can have multiple
   */
  responseDeclarations?: ResponseDeclaration[];

  /**
   * Outcome declarations for the item
   * @qti optional, can have multiple
   */
  outcomeDeclarations?: OutcomeDeclaration[];

  /**
   * Template declarations for the item
   * @qti optional, can have multiple
   */
  templateDeclarations?: TemplateDeclaration[];

  /**
   * Template processing rules
   * @qti optional
   */
  templateProcessing?: TemplateProcessing;

  /**
   * Stylesheet declarations for the item
   * @qti optional, can have multiple
   */
  stylesheets?: Stylesheet[];

  /**
   * The main body of the assessment item
   * @qti required
   */
  itemBody: ItemBody;

  /**
   * Time limits for this item
   * @qti optional
   */
  timeLimits?: TimeLimits;

  /**
   * End attempt interaction for this item
   * @qti optional
   */
  endAttemptInteraction?: EndAttemptInteraction;

  /**
   * Response processing rules
   * @qti optional
   */
  responseProcessing?: ResponseProcessing;

  /**
   * Modal feedback elements
   * @qti optional, can have multiple
   */
  modalFeedback?: ModalFeedback[];

  /**
   * Whether the item supports validation
   * @qti optional
   */
  validateResponses?: boolean;

  /**
   * Whether the item allows review
   * @qti optional
   */
  allowReview?: boolean;

  /**
   * Whether to show feedback during attempts
   * @qti optional
   */
  showFeedback?: boolean;

  /**
   * Whether to show the solution
   * @qti optional
   */
  showSolution?: boolean;

  /**
   * Maximum number of attempts allowed
   * @qti optional. Must be greater than 0
   */
  maxAttempts?: number;

  /**
   * XML schema version
   * @qti optional
   */
  xmlSchema?: string;

  /**
   * XML schema location
   * @qti optional
   */
  xmlSchemaLocation?: string;
}

