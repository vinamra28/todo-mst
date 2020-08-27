import { types, getParent, destroy, cast, Instance } from "mobx-state-tree";

export const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: "",
  })
  .actions((self) => ({
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

export interface IWishListItem {
  name: string;
  price: number;
  image?: string;
}

export const WishList = types
  .model({
    items: types.optional(types.array(WishListItem), []),
  })
  .actions((self) => ({
    add(item: IWishListItem) {
      self.items.push(item);
    },
    remove(item: IWishListItemX) {
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
type IWishListItemX = Instance<typeof WishListItem>;
