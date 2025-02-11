```typescript
export const createValidAssociateItemData = () => ({
  type: "associate",
  identifier: "item-001",
  title: "Match Countries and Capitals",
  interaction: {
    type: "associate",
    responseIdentifier: "RESPONSE",
    shuffle: false,
    maxAssociations: 4,
    questionStructure: {
      prompt: "Match each country with its capital city.",
      sourceChoices: [
        { identifier: "C1", content: "France" },
        { identifier: "C2", content: "Germany" },
        { identifier: "C3", content: "Italy" },
        { identifier: "C4", content: "Spain" },
      ],
      targetChoices: [
        { identifier: "T1", content: "Paris" },
        { identifier: "T2", content: "Berlin" },
        { identifier: "T3", content: "Rome" },
        { identifier: "T4", content: "Madrid" },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "directedPair",
    correctResponse: {
      value: [
        ["C1", "T1"],
        ["C2", "T2"],
        ["C3", "T3"],
        ["C4", "T4"],
      ],
    },
  },
});

export async function createValidDrawingItemData() {
  return {
    type: "drawing",
    identifier: "item-001",
    title: "Basic Drawing Task",
    interaction: {
      type: "drawing",
      responseIdentifier: "RESPONSE",
      questionStructure: {
        prompt: "Draw a simple house with a door and two windows.",
        canvas: {
          width: 800,
          height: 600,
        },
        object: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          mediaType: "image/png",
        },
      },
    },
    responseDeclaration: {
      identifier: "RESPONSE",
      cardinality: "single",
      baseType: "file",
      correctResponse: {
        value: [""],
      },
    },
  };
}

export const createValidExtendedTextItemData = () => ({
  type: "extended-text",
  identifier: "item-001",
  title: "Essay Question",
  interaction: {
    type: "extended-text",
    responseIdentifier: "RESPONSE",
    questionStructure: {
      prompt: "Write a short essay about your favorite book.",
      expectedLength: 200,
      expectedLines: 10,
      format: "plain",
      maxStrings: 1,
      minStrings: 1,
      patternMask: "[a-zA-Z0-9\\s\\p{P}]*",
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "single",
    baseType: "string",
    correctResponse: {
      value: [""], // Empty for open-ended responses
    },
  },
});

export const createValidGraphicAssociateItemData = () => ({
  type: "graphic-associate",
  identifier: "item-001",
  title: "Map Location Matching",
  interaction: {
    type: "graphic-associate",
    responseIdentifier: "RESPONSE",
    maxAssociations: 4,
    shuffle: false,
    questionStructure: {
      prompt:
        "Match each city marker to its corresponding landmark on the map.",
      object: {
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        width: 800,
        height: 600,
        type: "image/png",
      },
      associableHotspots: [
        {
          identifier: "C1",
          shape: "circle",
          coords: "100,100,10",
          matchMax: 1,
          label: "City Hall",
        },
        {
          identifier: "C2",
          shape: "circle",
          coords: "200,200,10",
          matchMax: 1,
          label: "Train Station",
        },
        {
          identifier: "C3",
          shape: "circle",
          coords: "300,300,10",
          matchMax: 1,
          label: "Museum",
        },
        {
          identifier: "C4",
          shape: "circle",
          coords: "400,400,10",
          matchMax: 1,
          label: "Park",
        },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "directedPair",
    correctResponse: {
      value: ["C1 C2", "C3 C4"],
    },
  },
});

export const createValidGraphicGapMatchItemData = () => ({
  type: "graphic-gap-match",
  identifier: "item-001",
  title: "Map Locations Test",
  interaction: {
    type: "graphic-gap-match",
    responseIdentifier: "RESPONSE",
    shuffle: false,
    questionStructure: {
      prompt: "Place each city label in its correct location on the map.",
      object: {
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        width: 800,
        height: 600,
        type: "image/png",
      },
      gapImgs: [
        {
          identifier: "GAP1",
          matchMax: 1,
          object: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
            width: 50,
            height: 30,
            type: "image/png",
          },
        },
        {
          identifier: "GAP2",
          matchMax: 1,
          object: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
            width: 50,
            height: 30,
            type: "image/png",
          },
        },
      ],
      associableHotspots: [
        {
          identifier: "SPOT1",
          shape: "circle",
          coords: "100,100,20",
          matchMax: 1,
        },
        {
          identifier: "SPOT2",
          shape: "rect",
          coords: "200,200,250,250",
          matchMax: 1,
        },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "directedPair",
    correctResponse: {
      value: ["GAP1 SPOT1", "GAP2 SPOT2"],
    },
  },
});

export const createValidGraphicOrderItemData = () => ({
  type: "graphic-order",
  identifier: "item-001",
  title: "Timeline Events Ordering",
  interaction: {
    type: "graphic-order",
    responseIdentifier: "RESPONSE",
    shuffle: true,
    questionStructure: {
      prompt: "Order the events on the timeline from earliest to latest.",
      object: {
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        width: 800,
        height: 400,
        type: "image/png",
      },
      orderChoices: [
        {
          identifier: "EVENT1",
          shape: "rect",
          coords: "50,50,150,100",
          label: "World War I",
        },
        {
          identifier: "EVENT2",
          shape: "rect",
          coords: "200,50,300,100",
          label: "Great Depression",
        },
        {
          identifier: "EVENT3",
          shape: "rect",
          coords: "350,50,450,100",
          label: "World War II",
        },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "ordered",
    baseType: "identifier",
    correctResponse: {
      value: ["EVENT1", "EVENT2", "EVENT3"],
    },
  },
});

export const createValidHotspotItemData = () => ({
  type: "hotspot",
  identifier: "item-001",
  title: "Map Region Selection",
  interaction: {
    type: "hotspot",
    responseIdentifier: "RESPONSE",
    maxChoices: 2,
    questionStructure: {
      prompt:
        "Select the two regions that are known for their historical landmarks.",
      object: {
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        width: 800,
        height: 600,
        type: "image/png",
      },
      hotspots: [
        {
          identifier: "REGION1",
          shape: "rect",
          coords: "100,100,200,200",
        },
        {
          identifier: "REGION2",
          shape: "circle",
          coords: "300,300,50",
        },
        {
          identifier: "REGION3",
          shape: "poly",
          coords: "500,100,600,100,550,200",
        },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "identifier",
    correctResponse: {
      value: ["REGION1", "REGION2"],
    },
  },
});

export const createValidInlineChoiceItemData = () => ({
  type: "inline-choice",
  identifier: "item-001",
  title: "Fill in the Blank Question",
  interaction: {
    type: "inline-choice",
    responseIdentifier: "RESPONSE",
    questionStructure: {
      prompt: "The capital of France is _____.",
      inlineChoices: [
        { identifier: "A", content: "London" },
        { identifier: "B", content: "Paris" },
        { identifier: "C", content: "Berlin" },
        { identifier: "D", content: "Madrid" },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "single",
    baseType: "identifier",
    correctResponse: {
      value: ["B"],
    },
  },
});

export const createValidMatchItemData = () => ({
  type: "match",
  identifier: "item-001",
  title: "Match Capitals with Countries",
  interaction: {
    type: "match",
    responseIdentifier: "RESPONSE",
    shuffle: true,
    maxAssociations: 4,
    questionStructure: {
      prompt: "Match each country with its capital city.",
      sourceChoices: [
        { identifier: "C1", content: "France" },
        { identifier: "C2", content: "Germany" },
        { identifier: "C3", content: "Italy" },
        { identifier: "C4", content: "Spain" },
      ],
      targetChoices: [
        { identifier: "T1", content: "Paris" },
        { identifier: "T2", content: "Berlin" },
        { identifier: "T3", content: "Rome" },
        { identifier: "T4", content: "Madrid" },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "directedPair",
    correctResponse: {
      value: [
        ["C1", "T1"],
        ["C2", "T2"],
        ["C3", "T3"],
        ["C4", "T4"],
      ],
    },
  },
});

export const createValidMediaItemData = () => ({
  type: "media",
  identifier: "item-001",
  title: "Video Analysis Question",
  interaction: {
    type: "media",
    responseIdentifier: "RESPONSE",
    autostart: true,
    minPlays: 0,
    maxPlays: 2,
    loop: false,
    questionStructure: {
      prompt: "Watch the video and identify the key concepts discussed.",
      object: {
        data: "https://example.com/sample-video.mp4",
        width: 640,
        height: 360,
        type: "video/mp4",
      },
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "single",
    baseType: "string",
    correctResponse: {
      value: ["Sample correct response text"],
    },
  },
});

export const createValidOrderItemData = () => ({
  type: "order",
  identifier: "item-001",
  title: "Sequence the Events",
  interaction: {
    type: "order",
    responseIdentifier: "RESPONSE",
    shuffle: true,
    orientation: "vertical",
    questionStructure: {
      prompt:
        "Put these historical events in chronological order, from earliest to most recent.",
      choices: [
        { identifier: "C1", content: "Declaration of Independence (1776)" },
        { identifier: "C2", content: "Constitution Ratification (1788)" },
        { identifier: "C3", content: "Louisiana Purchase (1803)" },
        { identifier: "C4", content: "Civil War Begins (1861)" },
      ],
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "ordered",
    baseType: "identifier",
    correctResponse: {
      value: ["C1", "C2", "C3", "C4"],
    },
  },
});

export const createValidSelectPointItemData = () => ({
  type: "select-point",
  identifier: "item-001",
  title: "Map Location Question",
  interaction: {
    type: "select-point",
    responseIdentifier: "RESPONSE",
    maxChoices: 2,
    minChoices: 1,
    questionStructure: {
      prompt: "Select the two major cities on this map.",
      object: {
        data: "https://example.com/map-image.jpg",
        width: 800,
        height: 600,
        type: "image/jpeg",
      },
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "multiple",
    baseType: "point",
    correctResponse: {
      value: ["200 300", "400 500"],
    },
  },
});

export const createValidSliderItemData = () => ({
  type: "slider",
  identifier: "item-001",
  title: "Temperature Scale Question",
  interaction: {
    type: "slider",
    responseIdentifier: "RESPONSE",
    "lower-bound": 0,
    "upper-bound": 50,
    step: 1,
    orientation: "horizontal",
    questionStructure: {
      prompt: "Set the slider to room temperature in Celsius.",
      object: {
        data: "https://example.com/temperature-scale.jpg",
        width: 800,
        height: 100,
        type: "image/jpeg",
      },
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "single",
    baseType: "float",
    correctResponse: {
      value: ["20"],
    },
  },
});

export function createValidTextEntryItemData(overrides = {}) {
  return {
    type: "text-entry",
    identifier: "item-001",
    title: "Simple Text Entry Question",
    interaction: {
      type: "text-entry",
      responseIdentifier: "RESPONSE",
      attributes: {
        "expected-length": 5,
        "pattern-mask": "[A-Za-z]+",
        placeholder: "Enter city name",
      },
      questionStructure: {
        prompt: "What is the capital of France?",
      },
    },
    responseDeclaration: {
      identifier: "RESPONSE",
      cardinality: "single",
      baseType: "string",
      correctResponse: {
        value: ["Paris"],
      },
    },
    ...overrides,
  };
}

export const createValidUploadItemData = () => ({
  type: "upload",
  identifier: "item-001",
  title: "File Upload Question",
  interaction: {
    type: "upload",
    responseIdentifier: "RESPONSE",
    questionStructure: {
      prompt: "Upload your completed assignment as a PDF file.",
      allowedTypes: ["application/pdf"],
      maxSize: 5242880, // 5MB in bytes
      maxFiles: 1,
    },
  },
  responseDeclaration: {
    identifier: "RESPONSE",
    cardinality: "single",
    baseType: "string",
    correctResponse: {
      value: [""], // Empty string as there's no specific correct file
    },
  },
});
```
