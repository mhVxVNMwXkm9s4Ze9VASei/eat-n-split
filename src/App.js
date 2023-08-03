import { useState } from "react";

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

function Button({ children, onClick }) {
	return (
		<button
			className="button"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default function App() {
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend((show) => false);
	}

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}

	function handleSelectedFriend(friend) {
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					friends={friends}
					onSelectFriend={handleSelectedFriend}
					selectedFriend={selectedFriend}
				/>
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? "Close Form" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
		</div>
	);
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					key={friend.id}
					friend={friend}
					onSelectFriend={onSelectFriend}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
	const isSelected = friend.id === selectedFriend?.id;

	return (
		<li class={isSelected && "selected"}>
			<img
				src={friend.image}
				alt={friend.name}
			/>
			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} ${Math.abs(friend.balance)}.
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owes you ${friend.balance}.
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even.</p>}

			<Button onClick={() => onSelectFriend(friend)}>
				{isSelected ? "Close" : "Select"}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48");
	const [name, setName] = useState("");

	function handleEvent(setter, event) {
		setter((e) => event.target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (!name || !imageURL) return;

		const id = crypto.randomUUID();

		const newFriend = {
			balance: 0,
			id,
			imageURL: `${imageURL}?=${id}`,
			name,
		};

		onAddFriend(newFriend);

		setImageURL("https://i.pravatar.cc/48");
		setName("");
	}

	return (
		<form
			className="form-add-friend"
			onSubmit={handleSubmit}
		>
			<label>👫 Friend name:</label>
			<input
				type="text"
				value={name}
				onChange={(event) => handleEvent(setName, event)}
			/>

			<label>🖼 Image URL</label>
			<input
				type="text"
				value={imageURL}
				onChange={(event) => handleEvent(setImageURL, event)}
			/>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const [payer, setPayer] = useState("user");

	const paidByFriend = bill ? bill - paidByUser + selectedFriend.balance : "";

	return (
		<form className="form-split-bill">
			<h2>Split a bill with {selectedFriend.name}.</h2>

			<label>💱 Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={(event) => setBill(Number(event.target.value))}
			/>

			<label>🧍‍♂️ Your expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(event) =>
					setPaidByUser(
						Number(event.target.value) > bill
							? paidByUser
							: Number(event.target.value)
					)
				}
			/>

			<label>👫 {selectedFriend.name}'s expense</label>
			<input
				type="text"
				value={paidByFriend}
				disabled
			/>

			<label>🤑 Who is paying the bill?</label>
			<select
				value={payer}
				onChange={(event) => setPayer(event.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>

			<Button>Split bill</Button>
		</form>
	);
}
