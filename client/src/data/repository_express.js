import axios from "axios";
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

//Test function to see if this thing works lol
const printUsers = async() => {
  const response = await axios.get(API_HOST + "/api/users")
  console.log(response.data);
}

//Verifies email and password match a user in the database. Returns the user or returns false
const verifyUser = async(email, password) =>{
    const response = await axios.get(API_HOST + "/api/users/login", { params: { email, password } });
    const user = response.data;
    
    if(user !== null){
        console.log("User Exists");
        return user;
    }

    console.log("Login failed")
    return false;
  }

  
const createUser = async(user) => {
    const response = await axios.post(API_HOST + "/api/users", user);
  
    return response.data;
}

const deleteUser = async(id) => {
    const response = await axios.delete(API_HOST + "/api/users", { params: { id } });
}
//Set user into localStorage
const setUserLocal = (username, id) => {
    const user = {username: username, id: id};
    console.log("Setting user into local storage:")
    console.log(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return JSON.parse(user);
}

const getProducts = async() => {
    const response = await axios.get(API_HOST + "/api/products");
    return response.data;
}

const findUser = async(id) => {
    const response = await axios.get(API_HOST + `/api/users/select/${id}`);
    return response.data;
  }

const verifyEmail = async(email) => {
    // returns true or false
    const response = await axios.get(API_HOST + `/api/users/verifyEmail/${email}`);
    // Testing
    console.log("verified email");
    return response.data;
}

const verifyPassword = async(password) => {
    //return true or false
    const response = await axios.get(API_HOST + `/api/users/verifyPassword/${password}`);
    return response.data
}
const verifyUsername = async(username) => {
    // return true or false
    const response = await axios.get(API_HOST + `/api/users/verifyUsername/${username}`);
    return response.data;
}

const updateEmail = async(formData) => {
    const response = await axios.put(API_HOST + "/api/users/update/email", formData);
    return response.data;
}

const updatePassword = async(formData) => {
    try {
        const response = await axios.put(API_HOST + "/api/users/update/password", formData);
        return response.data;
    } catch (error) {
        // Handle the error appropriately
        console.log("Error updating password: Password not strong enough");
        throw error;
      }
}


function removeUser() {
    localStorage.removeItem(USER_KEY);
}

export{
    verifyUser,
    printUsers,
    getProducts,
    setUserLocal,
    createUser,
    findUser,
    removeUser,
    getUser,
    verifyEmail,
    updateEmail,
    updatePassword,
    deleteUser,
    verifyUsername
}