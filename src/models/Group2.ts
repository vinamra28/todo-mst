/**
 * This file is the replica of Group.ts
 * In this we will be splitting up into different types
 */
import {
  types,
  flow,
  applySnapshot,
  getSnapshot,
  onSnapshot,
} from "mobx-state-tree";
import { WishList } from "./WishList";

const UserBase = types.model({
  id: types.identifier,
  name: types.string,
  gender: types.enumeration("gender", ["m", "f"]), //this is shorthand of above
  wishList: types.optional(WishList, {}),
  recipient: types.maybe(types.reference(types.late(() => User))),
});

const UserActions = types.model({}).actions((self) => ({
  //use of generators
  getSuggestions: flow(function* getSuggestions() {
    const response = yield window.fetch(
      `http://localhost:3001/suggestions_${UserBase.gender}`
    );
    const suggestions = yield response.json();
    UserBase.wishList.items.push(...suggestions);
  }),
  save: flow(function* save() {
    try {
      yield window.fetch(`http://localhost:3001/users/${UserBase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getSnapshot(self)),
      });
    } catch (error) {
      console.error("Uh oh, failed to save: ", error);
    }
  }),
  afterCreate() {
    onSnapshot(self, this.save);
  },
}));

const User = types.compose(UserBase, UserActions);

export const Group = types
  .model({
    users: types.map(User),
  })
  .actions((self) => {
    //volatile state
    // the state which lives as long as the instance of the group lives
    let controller: any;
    return {
      //this is lifecycle hook automatically called
      afterCreate() {
        this.load();
      },
      load: flow(function* load() {
        controller = window.AbortController && new window.AbortController();
        try {
          const response = yield window.fetch(`http://localhost:3001/users`, {
            signal: controller && controller.signal,
          });
          // applySnapshot(self.users, yield response.json());
          const users = yield response.json();
          applySnapshot(
            self.users,
            users.reduce((base, user) => ({ ...base, [user.id]: user }), {})
          );
          console.log("success");
        } catch (err) {
          console.log("aborted ", err.name);
        }
      }),
      reload() {
        // abort current request
        if (controller) controller.abort();
        this.load();
      },
      // hook
      beforeDestroy() {
        if (controller) controller.abort();
      },
      drawLots() {
        const allUsers = Array.from(self.users.values());

        // not enough users, bail out
        if (allUsers.length <= 1) return;

        // not assigned lots
        let remaining = allUsers.slice();

        allUsers.forEach((user) => {
          // edge case: the only person without recipient
          // is the same as the only remaining lot
          // swap lot's with some random other person
          if (remaining.length === 1 && remaining[0] === user) {
            const swapWith =
              allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
            user.recipients = swapWith.recipient;
            swapWith.recipient = self;
          } else
            while (!user.recipient) {
              // Pick random lot from remaing list
              let recipientIdx = Math.floor(Math.random() * remaining.length);

              // If it is not the current user, assign it as recipient
              // and remove the lot
              if (remaining[recipientIdx] !== user) {
                user.recipient = remaining[recipientIdx];
                remaining.splice(recipientIdx, 1);
              }
            }
        });
      },
    };
  });
