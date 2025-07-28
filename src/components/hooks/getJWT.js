import axios from "axios";

const getJWT = async (user) => {
  const res = await axios.post("http://localhost:5000/jwt", {
    email: user.email,
    
  });

  const token = res.data.token;

  // Save token to localStorage
  localStorage.setItem("access-token", token);
};
export default getJWT;
