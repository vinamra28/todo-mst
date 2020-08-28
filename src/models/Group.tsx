import { types, flow } from "mobx-state-tree";
import { WishList } from "./WishList";

const User = types
  .model({
    id: types.string,
    name: types.string,
    //gender: types.union(types.literal("m"), types.literal("f")),
    gender: types.enumeration("gender", ["m", "f"]), //this is shorthand of above
    wishList: types.optional(WishList, {}),
  })
  .actions((self) => ({
    //use of async and await
    /*async getSuggestions() {
      const response = await window.fetch(
        `http://localhost:3001/suggestions_${self.gender}`
      );
      const suggestions = await response.json();
      this.addSuggestions(suggestions);
    },*/
    //use of generators
    getSuggestions: flow(function* () {
      const response = yield window.fetch(
        `http://localhost:3001/suggestions_${self.gender}`
      );
      const suggestions = yield response.json();
      self.wishList.items.push(...suggestions);
    }),
    addSuggestions(suggestions: any) {
      self.wishList.items.push(...suggestions);
    },
  }));

export const Group = types.model({
  users: types.map(User),
});
