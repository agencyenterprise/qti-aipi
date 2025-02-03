import React from 'react';
import TextEntryInteraction from './TextEntryInteraction';
import TextEntryPlainDefaultVertical from './TextEntryPlainDefaultVertical';

enum TEXT_ENTRY_TYPE {
  DEFAULT = 'default-plain-horizontal',
  DEFAULT_VERTICAL = 'default-plain-vertical'
}

interface TextEntryInteractionAdapterProps {
  node: Element;
  onResponseChange: (responseIdentifier: string, value: string) => void;
  responseValue?: string;
}

const TextEntryInteractionAdapter: React.FC<TextEntryInteractionAdapterProps> = ({
  node,
  onResponseChange,
  responseValue
}) => {
  const getTextEntryInteractionSubType = (className?: string): TEXT_ENTRY_TYPE => {
    if (!className) return TEXT_ENTRY_TYPE.DEFAULT;
    return findClass('qti-orientation-vertical', className)
      ? TEXT_ENTRY_TYPE.DEFAULT_VERTICAL
      : TEXT_ENTRY_TYPE.DEFAULT;
  };

  // Helper function to find a class in a space-separated string
  const findClass = (needle: string, className: string): boolean => {
    const classTokens = className.split(' ');
    return classTokens.includes(needle);
  };

  // Get all data attributes from the node
  const getPassthroughAttrs = () => {
    const attrs: { [key: string]: string } = {};
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('data-')) {
        attrs[attr.name] = attr.value;
      }
    }
    return attrs;
  };

  const props = {
    responseIdentifier: node.getAttribute('response-identifier') || '',
    ...(node.hasAttribute('expected-length') && {
      expectedLength: node.getAttribute('expected-length')
    }),
    ...(node.hasAttribute('pattern-mask') && {
      patternMask: node.getAttribute('pattern-mask')
    }),
    patternMaskMessage: node.getAttribute('pattern-mask-message') || 'Invalid Input',
    placeholderText: node.getAttribute('placeholder') || '',
    ...(node.hasAttribute('format') && node.getAttribute('format')?.length > 0 && {
      format: node.getAttribute('format')
    }),
    ...(node.hasAttribute('spellcheck') && {
      spellcheck: node.getAttribute('spellcheck')
    }),
    ...(node.hasAttribute('maxlength') && {
      maxlength: node.getAttribute('maxlength')
    }),
    className: node.getAttribute('class') || '', // Pass the full class list
    ...getPassthroughAttrs() // Spread any additional data attributes
  };

  const interactionType = getTextEntryInteractionSubType(node.className);

  const handleChange = (data: { response: string; state?: any }) => {
    onResponseChange(props.responseIdentifier, data.response);
  };

  if (interactionType === TEXT_ENTRY_TYPE.DEFAULT_VERTICAL) {
    return (
      <TextEntryPlainDefaultVertical
        {...props}
        value={responseValue}
        onChange={handleChange}
      />
    );
  }

  return (
    <TextEntryInteraction
      {...props}
      value={responseValue}
      onChange={handleChange}
    />
  );
};

export default TextEntryInteractionAdapter;