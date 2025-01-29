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

export function generateAssessmentItemXml(item: QTIAssessmentItem): string {
  const responseDeclarationsXml = item.responseDeclarations?.map(rd => `
    <qti-response-declaration identifier="${rd.identifier}" cardinality="${rd.cardinality}" base-type="${rd.baseType}">
      <qti-correct-response>
        <qti-value>1</qti-value>
      </qti-correct-response>
    </qti-response-declaration>
  `).join('\n') || '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<qti-assessment-item 
  xmlns="http://www.imsglobal.org/xsd/qti/imsqtiasi_v3p0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd"
  identifier="${item.identifier}"
  title="${item.title}"
  adaptive="false"
  time-dependent="false">
  
  ${responseDeclarationsXml}
  
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0.0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>

  <qti-item-body>
    <!-- Item content will be added here -->
  </qti-item-body>

  <qti-response-processing>
    <qti-response-condition>
      <qti-response-if>
        <qti-match>
          <qti-variable identifier="RESPONSE"/>
          <qti-correct identifier="RESPONSE"/>
        </qti-match>
        <qti-set-outcome-value identifier="SCORE">
          <qti-base-value base-type="float">1.0</qti-base-value>
        </qti-set-outcome-value>
      </qti-response-if>
    </qti-response-condition>
  </qti-response-processing>
</qti-assessment-item>`;
}

export function generateAssessmentTestXml(test: QTIAssessmentTest): string {
  const sectionsXml = test.sections.map(section => `
    <qti-assessment-section identifier="${section.identifier}" title="${section.title}" visible="${section.visible}" keep-together="${section.keepTogether}">
      ${section.items.map(item => `
        <qti-assessment-item-ref identifier="${item.identifier}" href="${item.href}" category="assessment-item">
          <qti-item-session-control max-attempts="1" allow-review="true" show-feedback="true" allow-comment="true" />
          <qti-weight identifier="W1" value="1.0"/>
        </qti-assessment-item-ref>
      `).join('\n')}
    </qti-assessment-section>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<qti-assessment-test 
  xmlns="http://www.imsglobal.org/xsd/qti/imsqtiasi_v3p0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd"
  identifier="${test.identifier}"
  title="${test.title}">
  
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0.0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>
  
  <qti-test-part identifier="part1" navigation-mode="${test.navigationMode}" submission-mode="${test.submissionMode}">
    <qti-item-session-control max-attempts="1" allow-review="true" show-feedback="true" allow-comment="true" />
    ${sectionsXml}
  </qti-test-part>
  
  <qti-outcome-processing>
    <qti-set-outcome-value identifier="SCORE">
      <qti-sum>
        <qti-test-variables variable-identifier="SCORE"/>
      </qti-sum>
    </qti-set-outcome-value>
  </qti-outcome-processing>
</qti-assessment-test>`;
} 