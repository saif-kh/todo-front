const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = BASE_URL + "/api/todos";
export const GET_TODOS = API_URL + "/all";
export const ADD_TODO = API_URL + "/add";
export const CHANGE_TODO = API_URL + "/";
export const DELETE_TODO = API_URL + "/";
