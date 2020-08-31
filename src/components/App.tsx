import React, { Component } from "react";

import WishListView from "./WishListView";
import { observer } from "mobx-react";

class App extends Component {
  props: any;
  state: any;
  constructor(props: any) {
    super(props);
    this.props = props;
    this.state = { selectedUser: null };
  }
  render() {
    const { group } = this.props;
    const selectedUser = group.users.get(this.state.selectedUser);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">WishList</h1>
        </header>
        <button onClick={group.reload}>Reload</button>
        <select onChange={this.onSelectUser}>
          <option>- Select User -</option>
          {Array.from(group.users.values()).map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {/* {selectedUser && <WishListView wishList={selectedUser.wishList} />} */}
        {/* {selectedUser && (
          <button onClick={selectedUser.getSuggestions}>Suggestions</button>
        )} */}
        <button onClick={group.drawLots}>Draw lots</button>
        {selectedUser && <User user={selectedUser} />}
      </div>
    );
  }
  onSelectUser = (event: { target: { value: any } }) => {
    this.setState({ selectedUser: event.target.value });
  };
}

const User = observer(({ user }) => (
  <div>
    <WishListView wishList={user.wishList} readonly={false} />
    <button onClick={user.getSuggestions}>Suggestions</button>
    <hr />
    <h2>{user.recipient ? user.recipient.name : ""}</h2>
    {user.recipient && (
      <WishListView wishList={user.recipient.wishList} readonly />
    )}
  </div>
));

export default observer(App);
