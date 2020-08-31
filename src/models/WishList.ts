import { types, getParent, destroy, cast, Instance } from "mobx-state-tree";

export const WishListItemBase = types.model("WishListItem", {
  name: types.string,
  price: types.number,
  image: "",
});

export const WishListItem = WishListItemBase.actions((self) => ({
  changeName(newName: string) {
    self.name = newName;
  },
  changePrice(newPrice: number) {
    self.price = newPrice;
  },
  changeImage(newImage: string) {
    self.image = newImage;
  },
  remove() {
    const wishListParent = getParent<IWishList>(self, 2);
    wishListParent.remove(cast(self));
  },
}));

export const WishList = types
  .model("WishList", {
    items: types.optional(types.array(WishListItem), []),
  })
  .actions((self) => ({
    add(item: IWishListItem) {
      self.items.push(item);
    },
    remove(item: IWishListItem) {
      destroy(item);
    },
  }))
  .views((self) => ({
    get totalPrice(): number {
      return self.items.reduce(
        (sum: number, entry: IWishListItem) => sum + entry.price,
        0
      );
    },
  }));

type IWishList = Instance<typeof WishList>;
type IWishListItem = Instance<typeof WishListItemBase>;
