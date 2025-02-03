import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './EditorQTI.css';

interface EditorQTIProps {
  content: string;
  expectedLength?: string;
  placeholder?: string;
  editorHeight?: string;
  labelHeight?: string;
  counterStyle?: string;
  disabled?: boolean;
  onInput: (data: { html: string; text: string }) => void;
  onEditorReady: (data: { node: any }) => void;
}

const EditorQTI: React.FC<EditorQTIProps> = ({
  content,
  expectedLength,
  placeholder = '',
  editorHeight = '6.2rem',
  labelHeight = '6.7rem',
  counterStyle = 'none',
  disabled = false,
  onInput,
  onEditorReady
}) => {
  const [counter, setCounter] = useState(0);
  const editorRef = useRef<any>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const showCounter = counterStyle === 'up' || counterStyle === 'down';
  const isCounterUp = counterStyle === 'up';
  const computedExpectedLength = expectedLength ? parseInt(expectedLength) : 400;

  const getLength = () => {
    if (!editorRef.current) return 0;
    return editorRef.current.getContent({ format: 'text' }).length;
  };

  const getText = () => {
    if (!editorRef.current) return '';
    return editorRef.current.getContent({ format: 'text' });
  };

  const updateCounter = (contentLength: number) => {
    if (!showCounter) return;
    setCounter(isCounterUp ? contentLength : computedExpectedLength - contentLength);
  };

  const handleEditorChange = (content: string, editor: any) => {
    const text = editor.getContent({ format: 'text' });
    const length = text.length;

    if (expectedLength && length > computedExpectedLength) {
      editor.setContent(content.slice(0, computedExpectedLength));
      return;
    }

    let html = content;
    if (html === '<p><br></p>') html = '';

    updateCounter(length);
    onInput({ html, text });
  };

  const toggleEditorDisabled = () => {
    if (!labelRef.current || !rootRef.current) return;

    if (disabled) {
      labelRef.current.innerHTML = content;
      labelRef.current.classList.remove('qti-hidden');
      labelRef.current.setAttribute('tabIndex', '0');
      if (editorRef.current) {
        editorRef.current.mode.set('readonly');
      }
    } else {
      labelRef.current.innerHTML = '';
      labelRef.current.classList.add('qti-hidden');
      labelRef.current.setAttribute('tabIndex', '-1');
      if (editorRef.current) {
        editorRef.current.mode.set('design');
      }
    }
  };

  useEffect(() => {
    toggleEditorDisabled();
  }, [disabled]);

  return (
    <div ref={rootRef} className="quill-editor">
      <div
        ref={labelRef}
        style={{ height: labelHeight }}
        className={`ext-text-xhtml-default-label qti-hidden`}
      />
      <div className="editor">
        <Editor
          onInit={(evt, editor) => {
            editorRef.current = editor;
            onEditorReady({ node: { getResponse: getText } });
          }}
          initialValue={content}
          init={{
            height: editorHeight,
            menubar: true,
            plugins: ['lists'],
            toolbar: 'undo redo | bold italic underline | bullist numlist | blockquote',
            statusbar: false,
            placeholder,
            content_style: `
              body {
                font-family: inherit;
                font-size: inherit;
                background: var(--background);
                color: var(--foreground);
              }
            `,
            disabled: disabled,
            browser_spellcheck: false,
            entity_encoding: 'raw',
            forced_root_block: 'p',
            paste_as_text: true,
            base_url: '/tinymce',
            suffix: '.min'
          }}
          onEditorChange={handleEditorChange}
        />
      </div>
      {showCounter && (
        <div aria-hidden="true" className="ext-text-editor-counter">
          {counter}
          {isCounterUp && ` / ${computedExpectedLength}`}
        </div>
      )}
    </div>
  );
};

export default EditorQTI;