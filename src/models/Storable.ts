import { types, flow, getSnapshot, onSnapshot } from "mobx-state-tree";

export function createStorable(collection: string, attribute: string) {
  return types.model({}).actions((self) => ({
    save: flow(function* save() {
      try {
        yield window.fetch(
          `http://localhost:3001/${collection}/${self[attribute]}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getSnapshot(self)),
          }
        );
      } catch (e) {
        console.error("Uh oh, failed to save: ", e);
      }
    }),
    afterCreate() {
      onSnapshot(self, this.save);
    },
  }));
}
