import { types, flow, applySnapshot, Instance } from "mobx-state-tree";
import { WishList } from "./WishList";

import { createStorable } from "./Storable";

const User = types.compose(
  types
    .model("User", {
      id: types.identifier,
      name: types.string,
      gender: types.enumeration("gender", ["m", "f"]), //this is shorthand of above
      wishList: types.optional(WishList, {}),
      recipient: types.maybe(types.reference(types.late(() => User))),
    })
    .actions((self) => ({
      //use of generators
      getSuggestions: flow(function* getSuggestions() {
        const response = yield window.fetch(
          `http://localhost:3001/suggestions_${self.gender}`
        );
        const suggestions = yield response.json();
        self.wishList.items.push(...suggestions);
      }),
    })),
  createStorable("users", "id")
);

export const Group = types
  .model("Group", {
    users: types.map(User),
  })
  .actions((self) => {
    //volatile state
    // the state which lives as long as the instance of the group lives
    let controller: AbortController;
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
            users.reduce(
              (base: any, user: { id: any }) => ({ ...base, [user.id]: user }),
              {}
            )
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

export type IUser = Instance<typeof User>;
export type IGroup = Instance<typeof Group>;
