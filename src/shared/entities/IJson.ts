import type { EntryFieldTypes } from "contentful";

export interface IJson {
  contentTypeId: "json";
  fields: {
    name: EntryFieldTypes.Text;
    json: EntryFieldTypes.Object;
  };
}
