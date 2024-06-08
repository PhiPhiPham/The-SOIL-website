import axios from "axios";
// Constant variables to define keys for localStorage.
const USERS_KEY = "users";
const USER_KEY = "user";
const SPECIALS_KEY = "specialsData";
const api_host = "http://localhost:4000";

//Test function to see if this thing works lol
//yay it works
async function printUsers() {
  const response = await axios.get(api_host + "/api/users")
  console.log(response.data);
}

function initSpecials() {

  // Information pertainging to specials for the week used. Used in card and carousel component.
  const specials = [
    {
      special: "Hass Avocados",
      price: "$1.99 each",
      description: "The perfect superfood to spread on toast",
      img: "../avocados.png"
    },
    {
      special: "Roast Chicken",
      price: "$11.99",
      description: "Succulent and juicy roast chicken that can feed a family at an affordable cost",
      img: "../roast_chicken.png"
    },
    {
      special: "Lasagne",
      price: "$15.00",
      description: "Delicious, hearty and ready totake home",
      img: "../lasagne.png"
    },
    {
      special: "soup",
      price: "$5.00",
      description: "Perfect for winter",
      img: "../soup.png"
    },
    {
      special: "salmon",
      price: "$7.50",
      description: "Rich in protein, can be had raw or cooked",
      img: "../salmon.png"
    }
  ]

  const specialsString = JSON.stringify(specials);
  localStorage.setItem("specialsData", specialsString);

}

function initStore() {

  const products = [

    { 
      id:1, 
      name: "Apple Crumble",
      price: 8.99,
      image: "../apple_crumble.jpg"
    },

    { 
      id:2, 
      name: "Apples",
      price: 2.50,
      image: "../apples.jpg"
    },

    { 
      id:3, 
      name: "Bread",
      price: 4.00,
      image: "../bread.jpg"
    },

    { 
      id:4, 
      name: "Butter",
      price: 5.00,
      image: "../butter.jpg"
    },

    { 
      id:5, 
      name: "Cheese Board",
      price: 15.00,
      image: "../cheese_board.jpg"
    },

    { 
      id:6, 
      name: "Coffee Beans",
      price: 10.00,
      image: "../coffee_beans.jpg"
    },

    { 
      id:7, 
      name: "Dozen Eggs",
      price: 8.00,
      image: "../eggs.jpg"
    },

    { 
      id:8, 
      name: "Milk",
      price: 3.50,
      image: "../milk.jpg"
    },

    { 
      id:9, 
      name: "Oranges",
      price: 2.50,
      image: "../oranges.jpg"
    }
  ] 

  const productsString = JSON.stringify(products);
  localStorage.setItem("productsData", productsString);


}

// Function to verify if an email is already registered.
function verifyEmail(email) {
  const users = getUsers();
  for (const user of users) {
    if (email === user.email) {
      return false; // Email already exists
    }
  }
  return true; // Email is available
}

// Function to verify if a username is already taken.
function verifyUsername(username) {
  const users = getUsers();
  for (const user of users) {
    if (username === user.username) {
      return false; // Username already exists
    }
  }
  return true; // Username is available
}

// Function to retrieve user data from local storage.
function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return JSON.parse(data);
}

// Function to verify user credentials during login.
function verifyUser(email, password) {
  const users = getUsers();
  for (const user of users) {
    if (email === user.email && password === user.password) {
      console.log(user.username)
      setUser(user.username); // Set the current user in local storage.
      return true;
    }
  }

  return false;
}

// Function to set the current user in local storage.
function setUser(username) {
  localStorage.setItem(USER_KEY, username);
}

// Function to get the current logged-in user from local storage.
function getUser() {
  return localStorage.getItem(USER_KEY);
}

// Function to remove the current user from local storage (logout).
function removeUser() {
  localStorage.removeItem(USER_KEY);
}

// Function to add a new user to the existing user data in local storage.
function addUser(newUser) {
  const existingUsers = getUsers();
  newUser.dateCreated = new Date().toISOString().split("T")[0];
  existingUsers.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
}

// Function to update user profile
function updateUser(username, newData) {
  const users = getUsers();
  const updatedUsers = users.map((user) => {
    if (user.username === username) {
      return { ...user, ...newData };
    }
    return user;
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  setUser(username)
  console.log("Updated USER_KEY:", localStorage.getItem(USER_KEY)); // Log the updated USER_KEY
  console.log("Username:", username);
}

function getUserDetails(username) {
  const users = getUsers();
  for (const user of users) {
    if (username === user.username) {
      return user;
    }
  }
}

// Function to delete user profile
function deleteUser(username) {
  const users = getUsers();
  const updatedUsers = users.filter((user) => user.username !== username);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}

// Email validation function
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Function to verify if the password is strong
const isPasswordStrong = (password) => {
  const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/><.,`\[\]\\\-]).{8,}$/;
  return strongPasswordRegex.test(password);
}

// Exporting functions to be used in other parts of the application.
export {
  verifyUser,
  getUser,
  removeUser,
  verifyEmail,
  addUser,
  verifyUsername,
  getUsers,
  updateUser,
  deleteUser,
  initSpecials,
  validateEmail,
  isPasswordStrong,
  getUserDetails,
  initStore,
  printUsers
};
