import { types } from "mobx-state-tree";
import { WishList } from "./WishList";

const User = types.model({
  id: types.string,
  name: types.string,
  //gender: types.union(types.literal("m"), types.literal("f")),
  gender: types.enumeration("gender", ["m", "f"]), //this is shorthand of above
  wishList: types.optional(WishList, {}),
});

export const Group = types.model({
  users: types.map(User),
});
