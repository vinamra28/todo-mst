import React, { Component } from "react";

import WishListView from "./WishListView";

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
        <select onChange={this.onSelectUser}>
          <option>- Select User -</option>
          {Array.from(group.users.values()).map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {selectedUser && <WishListView wishList={selectedUser.wishList} />}
      </div>
    );
  }
  onSelectUser = (event: { target: { value: any } }) => {
    this.setState({ selectedUser: event.target.value });
  };
}

export default App;
