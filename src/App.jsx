const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

import { useState } from "react";

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriendID, setSelectedFriendID] = useState(null);
  const selectedFriend = friends.filter(
    (friend) => friend.id === selectedFriendID
  )[0];

  const handleSetSelectedFriend = (id) => {
    if (selectedFriendID === id) {
      setSelectedFriendID(null);
      return;
    }
    setSelectedFriendID(id);
  };

  const moneyUpdateLogic = (e, action, expense) => {
    e.preventDefault();
    if (action === 1) {
      setFriends(
        friends.map((friend) => {
          if (friend.id === selectedFriendID) {
            friend.balance -= expense;
          }
          return friend;
        })
      );
    } else {
      setFriends(
        friends.map((friend) => {
          if (friend.id === selectedFriendID) {
            friend.balance += expense;
          }
          return friend;
        })
      );
    }
    setSelectedFriendID(null);
  };

  return (
    <div className="app">
      <SideBar
        friends={friends}
        setFriends={setFriends}
        setSelectedFriendID={handleSetSelectedFriend}
      />
      {selectedFriendID && (
        <FormSplitBill
          friend={selectedFriend}
          moneyUpdateLogic={moneyUpdateLogic}
        />
      )}
    </div>
  );
};

const FormSplitBill = ({ friend, moneyUpdateLogic }) => {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [who, setWho] = useState(1);
  const friendExpense = bill - myExpense;

  const handleSetBill = (e) => {
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    setBill(Number(val));
  };
  const handleSetMyExpense = (e) => {
    if (!bill) return;
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val > bill) return;
    setMyExpense(Number(val));
  };
  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {friend.name}</h2>
      <label htmlFor="bill-value">💰 Bill value</label>
      <input
        type="text"
        id="bill-value"
        value={bill}
        onChange={(e) => handleSetBill(e)}
      />
      <label htmlFor="your-expense">🧍‍♀️ Your expense</label>
      <input
        type="text"
        id="your-expense"
        value={myExpense}
        onChange={(e) => handleSetMyExpense(e)}
      />
      <label htmlFor="friend-expense">👫 {friend.name} expense</label>
      <input type="text" id="friend-expense" readOnly value={friendExpense} />
      <label htmlFor="who">🤑 Who is paying the bill</label>
      <select id="who" onChange={(e) => setWho(e.target.value)}>
        <option value={1}>You</option>
        <option value={2}>{friend.name}</option>
      </select>
      <button
        className="button"
        onClick={(e) => moneyUpdateLogic(e, who, friendExpense)}
      >
        Split bill
      </button>
    </form>
  );
};

const SideBar = ({ friends, setFriends, setSelectedFriendID }) => {
  const [addFriend, setAddFriend] = useState(false);
  const handleAddFriendForm = () => {
    setAddFriend((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.key}
            setSelectedFriendID={setSelectedFriendID}
          />
        ))}
      </ul>
      {!addFriend ? (
        <Button text={"Add friend"} fn={handleAddFriendForm} />
      ) : (
        <FormAddFriends
          setFriends={setFriends}
          friends={friends}
          setAddFriend={setAddFriend}
        />
      )}
      {addFriend && <Button text={"Close"} fn={handleAddFriendForm} />}
    </div>
  );
};

const Button = ({ text, fn }) => {
  return (
    <button className="button" onClick={() => fn()}>
      {text}
    </button>
  );
};

const FormAddFriends = ({ friends, setAddFriend, setFriends }) => {
  const [friendName, setFriendName] = useState("");
  const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48");

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!friendName || !imageURL) return;
    const id = generateUniqueId();
    const friend = {
      name: friendName,
      image: imageURL,
      balance: 0,
      id,
    };
    setFriends([...friends, friend]);
    setFriendName("");
    setAddFriend(false);
  };
  return (
    <form className="form-add-friend" onClick={(e) => handleAddFriend(e)}>
      <label htmlFor="name">👫 Friend name</label>
      <input
        type="text"
        id="name"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label htmlFor="image">🌄 Image URL</label>
      <input
        type="text"
        id="image"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
};

const Friend = ({ friend, setSelectedFriendID }) => {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 ? (
        <p>You and {friend.name} are even</p>
      ) : friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {friend.balance * -1}€
        </p>
      ) : (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      <button className="button" onClick={() => setSelectedFriendID(friend.id)}>
        Select
      </button>
    </li>
  );
};

export default App;
