// response-mapping.ts
export interface ResponseMapping {
  lowerBound?: number;
  upperBound?: number;
  defaultValue?: number;
  mappingEntries: {
    mapKey: string;
    mappedValue: number;
    caseSensitive?: boolean;
  }[];
}

