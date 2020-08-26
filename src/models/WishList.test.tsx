import { getSnapshot, onSnapshot, onPatch } from "mobx-state-tree";
import { WishListItem, WishList } from "./WishList";
import { reaction } from "mobx";

//testing the WishListItem
it("can create an instance of a model", () => {
  const item = WishListItem.create({
    name: "vinamra",
    price: 28.78,
  });
  expect(item.price).toBe(28.78);
  expect(item.image).toBe("");
  item.changeName("jain");
  expect(item.name).toBe("jain");
});

//testing the WishList
it("can create an wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "vinamra",
        price: 28.78,
      },
      {
        name: "vina",
        price: 28.78,
      },
    ],
  });
  expect(list.items.length).toBe(2);
});

/**
 * using Snapshot from MST to match the whole snapshot
 */
it("can add new item", () => {
  const list = WishList.create();
  list.add({
    name: "vinamra",
    price: 28.78,
  });
  expect(list.items.length).toBe(1);
  list.items[0].changeName("jain");
  expect(list.items[0].name).toBe("jain");
  expect(getSnapshot(list)).toEqual({
    items: [
      {
        name: "jain",
        price: 28.78,
        image: "",
      },
    ],
  });
  // to MatchSnapshot creates a snapshot in the current dir
  expect(getSnapshot(list)).toMatchSnapshot();
});

/**
 * using OnSnapshot
 */
it("can add new item using OnSnapshot", () => {
  const list = WishList.create();
  const states: any = [];
  //to record snapshots
  onSnapshot(list, (snapshot) => {
    console.log(snapshot);
    states.push(snapshot);
  });
  list.add({
    name: "vinamra",
    price: 28.78,
  });
  expect(list.items.length).toBe(1);
  list.items[0].changeName("jain");
  expect(list.items[0].name).toBe("jain");
  expect(getSnapshot(list)).toEqual({
    items: [
      {
        name: "jain",
        price: 28.78,
        image: "",
      },
    ],
  });
  // to MatchSnapshot creates a snapshot in the current dir
  //obtain immutable snapshots of the state using getSnapshot
  expect(getSnapshot(list)).toMatchSnapshot();
  expect(states).toMatchSnapshot();
});

it("can add new item using onPatch", () => {
  const list = WishList.create();
  const patches: any = [];
  //to record snapshots
  onPatch(list, (patch) => {
    patches.push(patch);
  });
  list.add({
    name: "vinamra",
    price: 28.78,
  });

  list.items[0].changeName("jain");

  // to MatchSnapshot creates a snapshot in the current dir
  //obtain immutable snapshots of the state using getSnapshot
  expect(patches).toMatchSnapshot();
});

it("can calculate total price of a wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "jain",
        price: 28,
        image: "",
      },
      {
        name: "jain",
        price: 28,
        image: "",
      },
      {
        name: "jain",
        price: 20,
        image: "",
      },
    ],
  });
  expect(list.totalPrice).toBe(76);
  let changed = 0;
  reaction(
    () => list.totalPrice,
    () => changed++
  );
  expect(changed).toBe(0);
  console.log(list.totalPrice);
  list.items[0].changeName("Test");
  expect(changed).toBe(0);
  //Only if the price is changed then the value of 'changed' will increase to 1
  list.items[0].changePrice(10);
  expect(changed).toBe(1);
});
