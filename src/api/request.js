import axios from "axios";

const request = axios.create({
  baseURL: "http://192.168.1.11:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default request;
