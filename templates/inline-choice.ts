import { QtiItem } from '../types/qti-item';

interface MathML {
  type: 'mathml';
  content: string;
}

interface Choice {
  identifier: string;
  content: string | MathML;
}

interface InlineChoiceInteraction {
  responseIdentifier: string;
  choices: Choice[];
  correctChoice: string;
}

interface TextBlock {
  type: 'text' | 'linebreak' | 'mathml';
  content: string;
}

interface InlineChoice {
  type: 'inline-choice';
  interaction: InlineChoiceInteraction;
}

type ContentBlock = TextBlock | InlineChoice;

interface InlineChoiceOptions {
  title: string;
  prompt?: string;
  blockquote?: {
    content: ContentBlock[];
  };
  content?: ContentBlock[];
  xmlns?: {
    mathml?: boolean;
  };
}

const isInlineChoice = (block: ContentBlock): block is InlineChoice => {
  return block.type === 'inline-choice';
};

/**
 * Creates a new inline choice QTI item template
 * @param options Configuration options for the inline choice item
 */
export const createInlineChoiceTemplate = (
  options: InlineChoiceOptions
): Omit<QtiItem, '_id' | 'createdAt' | 'updatedAt'> => {
  const { title, prompt, blockquote, content, xmlns } = options;

  // Collect all interactions from both blockquote and content
  const allInteractions: InlineChoiceInteraction[] = [];
  const collectInteractions = (blocks: ContentBlock[] | undefined) => {
    blocks?.forEach(block => {
      if (isInlineChoice(block)) {
        allInteractions.push(block.interaction);
      }
    });
  };
  collectInteractions(blockquote?.content);
  collectInteractions(content);

  // Create the item body content
  const createContentElements = (blocks: ContentBlock[]): any[] => {
    return blocks.map(block => {
      if (block.type === 'text') {
        return block.content;
      } else if (block.type === 'linebreak') {
        return { br: {} };
      } else if (block.type === 'mathml') {
        return { math: block.content };
      } else if (isInlineChoice(block)) {
        return {
          'qti-inline-choice-interaction': {
            'response-identifier': block.interaction.responseIdentifier,
            'qti-inline-choice': block.interaction.choices.map(choice => {
              if (typeof choice.content === 'string') {
                return {
                  _: choice.content,
                  identifier: choice.identifier
                };
              } else {
                return {
                  math: choice.content.content,
                  identifier: choice.identifier
                };
              }
            })
          }
        };
      }
      return '';
    });
  };

  const itemBody: any = {};
  if (prompt) {
    itemBody.p = prompt;
  }

  if (blockquote) {
    itemBody.blockquote = {
      p: createContentElements(blockquote.content)
    };
  }

  if (content) {
    if (!itemBody.p) {
      itemBody.p = createContentElements(content);
    } else {
      itemBody.p = [itemBody.p, ...createContentElements(content)];
    }
  }

  const namespaces: Record<string, string> = {
    xmlns: 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd'
  };

  if (xmlns?.mathml) {
    namespaces['xmlns:m'] = 'http://www.w3.org/1998/Math/MathML';
    namespaces['xsi:schemaLocation'] += '  http://www.w3.org/1998/Math/MathML https://purl.imsglobal.org/spec/mathml/v3p0/schema/xsd/mathml3.xsd';
  }

  return {
    identifier: `ic-${Date.now()}`,
    title,
    type: 'qti-assessment-item',
    content: {
      ...namespaces,
      identifier: `ic-${Date.now()}`,
      title,
      adaptive: 'false',
      'time-dependent': 'false',
      'qti-response-declaration': allInteractions.map(interaction => ({
        identifier: interaction.responseIdentifier,
        cardinality: 'single',
        'base-type': 'identifier',
        'qti-correct-response': {
          'qti-value': interaction.correctChoice
        }
      })),
      'qti-outcome-declaration': {
        identifier: 'SCORE',
        cardinality: 'single',
        'base-type': 'float'
      },
      'qti-item-body': itemBody,
      'qti-response-processing': {
        'qti-response-condition': {
          'qti-response-if': {
            'qti-match': allInteractions.map(interaction => ({
              'qti-variable': { identifier: interaction.responseIdentifier },
              'qti-correct': { identifier: interaction.responseIdentifier }
            }))
          }
        }
      }
    }
  };
};
