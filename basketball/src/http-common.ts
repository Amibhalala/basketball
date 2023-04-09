import axios from "axios";

export default axios.create({
  baseURL: String(process.env.REACT_APP_POSTGRES_URL),
  headers: {
    "Content-type": "application/json"
  }
});