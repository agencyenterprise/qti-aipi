import type { AssessmentItem } from '../types/qti';

/**
 * Converts an AssessmentItem object to QTI 3.0 compliant XML
 * @param item The AssessmentItem to convert
 * @returns QTI XML string
 */
export function convertToQtiXml(item: AssessmentItem): string {
  const doc = document.implementation.createDocument(null, 'qti-assessment-item', null);
  const root = doc.documentElement;

  // Set root attributes
  root.setAttribute('xmlns', 'http://www.imsglobal.org/xsd/imsqti_v3p0');
  root.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  root.setAttribute('xsi:schemaLocation', 'http://www.imsglobal.org/xsd/imsqti_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd');
  root.setAttribute('identifier', item.id);
  root.setAttribute('title', item.title);
  root.setAttribute('adaptive', 'false');
  root.setAttribute('time-dependent', item.metadata.timeDependent ? 'true' : 'false');

  // Add response declarations
  item.responseDeclarations.forEach(response => {
    const responseDecl = doc.createElement('qti-response-declaration');
    responseDecl.setAttribute('identifier', response.identifier);
    responseDecl.setAttribute('cardinality', response.cardinality);
    responseDecl.setAttribute('base-type', response.baseType);
    if (response.correctResponse) {
      const correctResponse = doc.createElement('qti-correct-response');
      const value = doc.createElement('qti-value');
      value.textContent = response.correctResponse.toString();
      correctResponse.appendChild(value);
      responseDecl.appendChild(correctResponse);
    }
    root.appendChild(responseDecl);
  });

  // Add outcome declarations
  item.outcomeDeclarations.forEach(outcome => {
    const outcomeDecl = doc.createElement('qti-outcome-declaration');
    outcomeDecl.setAttribute('identifier', outcome.identifier);
    outcomeDecl.setAttribute('cardinality', outcome.cardinality);
    outcomeDecl.setAttribute('base-type', outcome.baseType);
    if (outcome.defaultValue !== undefined) {
      const defaultValue = doc.createElement('qti-default-value');
      const value = doc.createElement('qti-value');
      value.textContent = outcome.defaultValue.toString();
      defaultValue.appendChild(value);
      outcomeDecl.appendChild(defaultValue);
    }
    root.appendChild(outcomeDecl);
  });

  // Add item body
  const itemBody = doc.createElement('qti-item-body');
  
  // Add interactions
  item.itemBody.interactions.forEach(interaction => {
    const interactionElem = doc.createElement(`qti-${interaction.type}-interaction`);
    
    // Add prompt
    const prompt = doc.createElement('qti-prompt');
    prompt.textContent = interaction.prompt;
    interactionElem.appendChild(prompt);

    // Add interaction-specific elements
    switch (interaction.type) {
      case 'choice':
        interaction.choices.forEach(choice => {
          const simpleChoice = doc.createElement('qti-simple-choice');
          simpleChoice.setAttribute('identifier', choice.id);
          simpleChoice.textContent = choice.content;
          interactionElem.appendChild(simpleChoice);
        });
        break;

      case 'match':
        const sourceList = doc.createElement('qti-simple-match-set');
        interaction.sourceItems.forEach(source => {
          const simpleAssociable = doc.createElement('qti-simple-associable-choice');
          simpleAssociable.setAttribute('identifier', source.id);
          simpleAssociable.setAttribute('match-max', '1');
          simpleAssociable.textContent = source.content;
          sourceList.appendChild(simpleAssociable);
        });
        interactionElem.appendChild(sourceList);

        const targetList = doc.createElement('qti-simple-match-set');
        interaction.targetItems.forEach(target => {
          const simpleAssociable = doc.createElement('qti-simple-associable-choice');
          simpleAssociable.setAttribute('identifier', target.id);
          simpleAssociable.setAttribute('match-max', '1');
          simpleAssociable.textContent = target.content;
          targetList.appendChild(simpleAssociable);
        });
        interactionElem.appendChild(targetList);
        break;

      case 'order':
        interaction.items.forEach(orderItem => {
          const simpleChoice = doc.createElement('qti-simple-choice');
          simpleChoice.setAttribute('identifier', orderItem.id);
          simpleChoice.textContent = orderItem.content;
          interactionElem.appendChild(simpleChoice);
        });
        break;

      case 'textEntry':
        // Text entry interactions don't need additional elements
        break;

      case 'extendedText':
        if (interaction.maxLength) {
          interactionElem.setAttribute('max-strings', interaction.maxLength.toString());
        }
        if (interaction.minLength) {
          interactionElem.setAttribute('min-strings', interaction.minLength.toString());
        }
        interactionElem.setAttribute('format', interaction.format);
        break;
    }

    itemBody.appendChild(interactionElem);
  });

  root.appendChild(itemBody);

  // Serialize to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
} 