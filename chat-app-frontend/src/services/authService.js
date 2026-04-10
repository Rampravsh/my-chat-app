import API from "./api";

const register = async (userData) => {
  const response = await API.post("/user", userData);
  // Assuming your backend sends the token upon successful registration
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("name", response.data.name); // Store user info too
    localStorage.setItem("email", response.data.email); // Store user email
    localStorage.setItem("pic", response.data.pic); // Store user profile picture
    localStorage.setItem("_id", response.data._id); // Store user ID
  }
  return response.data;
};

const login = async (userData) => {
  const response = await API.post("/user/login", userData);
   
  // Assuming your backend sends the token upon successful login
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("name", response.data.name); // Store user info too
    localStorage.setItem("email", response.data.email); // Store user email
    localStorage.setItem("pic", response.data.pic); // Store user profile picture
    localStorage.setItem("_id", response.data._id); // Store user ID
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("pic");
  localStorage.removeItem("_id");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
