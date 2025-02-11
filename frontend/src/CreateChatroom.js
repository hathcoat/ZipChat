import axios from "axios";

export const createChatroom = async (name, usernames) => {
  try {
    console.log(name)
    console.log(usernames)
    const res = await axios.post("http://localhost:5000/api/chatrooms", {
      name,
      members: usernames
    });
    return res.data;
  } catch (err) {
    console.error(err.response.data);
  }
};