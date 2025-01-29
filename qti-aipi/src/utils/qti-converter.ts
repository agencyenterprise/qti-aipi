interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface QtiConversionResult {
  testXml: string;
  items: Array<{
    xml: string;
    identifier: string;
    href: string;
  }>;
}

export function convertToQtiXml(assessment: Assessment): QtiConversionResult {
  // Create a placeholder item if there are no questions
  const placeholderItem = {
    id: 'placeholder-1',
    type: 'multiple_choice' as const,
    prompt: 'Placeholder question',
    options: ['Option 1', 'Option 2'],
    correctAnswer: 'Option 1',
    points: 1
  };

  const questions = assessment.questions.length > 0 ? assessment.questions : [placeholderItem];
  
  const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<qti-assessment-test 
  xmlns="http://www.imsglobal.org/spec/qti/v3p0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/spec/qti/v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd"
  identifier="${assessment.id}"
  title="${escapeXml(assessment.title)}"
  adaptive="false"
  time-dependent="false">
  
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0.0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  
  <qti-test-part identifier="part1" navigation-mode="linear" submission-mode="individual">
    <qti-item-session-control max-attempts="1" allow-review="true" show-feedback="true" allow-comment="true" />
    <qti-assessment-section identifier="section-1" title="${escapeXml(assessment.title)}" visible="true">
      ${questions.map((question) => `
        <qti-assessment-item-ref identifier="item-${question.id}" href="./items/item-${question.id}.xml" category="assessment-item">
          <qti-item-session-control max-attempts="1" allow-review="true" show-feedback="true" allow-comment="true" />
          <qti-weight identifier="W1" value="${question.points}.0"/>
        </qti-assessment-item-ref>
      `).join('\n')}
    </qti-assessment-section>
  </qti-test-part>
  
  <qti-outcome-processing>
    <qti-set-outcome-value identifier="SCORE">
      <qti-sum>
        <qti-test-variables variable-identifier="SCORE"/>
      </qti-sum>
    </qti-set-outcome-value>
  </qti-outcome-processing>
</qti-assessment-test>`;

  const items = questions.map(question => ({
    xml: convertQuestionToQtiItem(question),
    identifier: `item-${question.id}`,
    href: `items/item-${question.id}.xml`
  }));

  return {
    testXml,
    items
  };
}

function convertQuestionToQtiItem(question: Question): string {
  const itemXml = `<?xml version="1.0" encoding="UTF-8"?>
<qti-assessment-item 
  xmlns="http://www.imsglobal.org/spec/qti/v3p0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/spec/qti/v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_item_v3p0.xsd"
  identifier="item-${question.id}"
  title="${escapeXml(question.prompt)}"
  adaptive="false"
  time-dependent="false">
  ${getQuestionContent(question)}
</qti-assessment-item>`;

  return itemXml;
}

function getQuestionContent(question: Question): string {
  switch (question.type) {
    case 'multiple_choice':
      return getMultipleChoiceContent(question);
    case 'true_false':
      return getTrueFalseContent(question);
    case 'short_answer':
      return getShortAnswerContent(question);
    case 'essay':
      return getEssayContent(question);
    default:
      throw new Error(`Unsupported question type: ${question.type}`);
  }
}

function getMultipleChoiceContent(question: Question): string {
  const options = question.options || [];
  const correctAnswer = question.correctAnswer as string;

  return `
  <qti-response-declaration identifier="RESPONSE" cardinality="single" base-type="identifier">
    <qti-correct-response>
      <qti-value>${escapeXml(correctAnswer)}</qti-value>
    </qti-correct-response>
  </qti-response-declaration>
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  <qti-item-body>
    <qti-choice-interaction response-identifier="RESPONSE" shuffle="false" max-choices="1">
      <qti-prompt>${escapeXml(question.prompt)}</qti-prompt>
      ${options.map((option, index) => `
        <qti-simple-choice identifier="choice-${index}" fixed="true">${escapeXml(option)}</qti-simple-choice>
      `).join('')}
    </qti-choice-interaction>
  </qti-item-body>
  <qti-response-processing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>`;
}

function getTrueFalseContent(question: Question): string {
  return `
  <qti-response-declaration identifier="RESPONSE" cardinality="single" base-type="boolean">
    <qti-correct-response>
      <qti-value>${question.correctAnswer}</qti-value>
    </qti-correct-response>
  </qti-response-declaration>
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  <qti-item-body>
    <qti-choice-interaction response-identifier="RESPONSE" shuffle="false" max-choices="1">
      <qti-prompt>${escapeXml(question.prompt)}</qti-prompt>
      <qti-simple-choice identifier="true">True</qti-simple-choice>
      <qti-simple-choice identifier="false">False</qti-simple-choice>
    </qti-choice-interaction>
  </qti-item-body>
  <qti-response-processing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>`;
}

function getShortAnswerContent(question: Question): string {
  return `
  <qti-response-declaration identifier="RESPONSE" cardinality="single" base-type="string">
    <qti-correct-response>
      <qti-value>${escapeXml(question.correctAnswer as string)}</qti-value>
    </qti-correct-response>
  </qti-response-declaration>
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  <qti-item-body>
    <qti-extended-text-interaction response-identifier="RESPONSE" expected-length="200">
      <qti-prompt>${escapeXml(question.prompt)}</qti-prompt>
    </qti-extended-text-interaction>
  </qti-item-body>
  <qti-response-processing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>`;
}

function getEssayContent(question: Question): string {
  return `
  <qti-response-declaration identifier="RESPONSE" cardinality="single" base-type="string"/>
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  <qti-item-body>
    <qti-extended-text-interaction response-identifier="RESPONSE" expected-length="1000">
      <qti-prompt>${escapeXml(question.prompt)}</qti-prompt>
    </qti-extended-text-interaction>
  </qti-item-body>
  <qti-response-processing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/map_response"/>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function parseQtiXml(xml: string): Assessment {
  // TODO: Implement XML parsing logic
  throw new Error('XML parsing not implemented yet');
} 