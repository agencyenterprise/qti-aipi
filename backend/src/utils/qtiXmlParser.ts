import { DOMParser, Element } from '@xmldom/xmldom';

interface QTIAssessmentItem {
  identifier: string;
  title: string;
  baseType?: string;
  responseDeclarations?: Array<{
    identifier: string;
    baseType: string;
    cardinality: string;
  }>;
}

interface QTIAssessmentTest {
  identifier: string;
  title: string;
  navigationMode: string;
  submissionMode: string;
  sections: Array<{
    identifier: string;
    title: string;
    visible: boolean;
    keepTogether: boolean;
    items: Array<{
      identifier: string;
      href: string;
    }>;
  }>;
}

export function parseQtiXml(xmlString: string): QTIAssessmentItem | QTIAssessmentTest {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  // Check if this is an assessment item or test
  const assessmentItem = doc.getElementsByTagName('qti-assessment-item')[0];
  const assessmentTest = doc.getElementsByTagName('qti-assessment-test')[0];

  if (assessmentItem) {
    return parseAssessmentItem(assessmentItem);
  } else if (assessmentTest) {
    return parseAssessmentTest(assessmentTest);
  }

  throw new Error('Invalid QTI XML: Must contain either qti-assessment-item or qti-assessment-test');
}

function parseAssessmentItem(element: Element): QTIAssessmentItem {
  const identifier = element.getAttribute('identifier') || '';
  const title = element.getAttribute('title') || '';

  const responseDeclarations = Array.from(element.getElementsByTagName('qti-response-declaration')).map((rd: Element) => ({
    identifier: rd.getAttribute('identifier') || '',
    baseType: rd.getAttribute('base-type') || '',
    cardinality: rd.getAttribute('cardinality') || ''
  }));

  return {
    identifier,
    title,
    baseType: responseDeclarations[0]?.baseType,
    responseDeclarations
  };
}

function parseAssessmentTest(element: Element): QTIAssessmentTest {
  const identifier = element.getAttribute('identifier') || '';
  const title = element.getAttribute('title') || '';

  const testPart = element.getElementsByTagName('qti-test-part')[0];
  const navigationMode = testPart?.getAttribute('navigation-mode') || 'linear';
  const submissionMode = testPart?.getAttribute('submission-mode') || 'individual';

  const sections = Array.from(element.getElementsByTagName('qti-assessment-section')).map((section: Element) => ({
    identifier: section.getAttribute('identifier') || '',
    title: section.getAttribute('title') || '',
    visible: section.getAttribute('visible') !== 'false',
    keepTogether: section.getAttribute('keep-together') !== 'false',
    items: Array.from(section.getElementsByTagName('qti-assessment-item-ref')).map((item: Element) => ({
      identifier: item.getAttribute('identifier') || '',
      href: item.getAttribute('href') || ''
    }))
  }));

  return {
    identifier,
    title,
    navigationMode,
    submissionMode,
    sections
  };
} 
