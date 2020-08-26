import {
  types,
  getParent,
  destroy,
  getParentOfType,
  Instance,
} from "mobx-state-tree";

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
      getParentOfType(
        getParentOfType(self, WishListItem),
        WishListItem
      ).remove();
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
