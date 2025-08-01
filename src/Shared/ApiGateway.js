import { API_BASE } from "./config";

export default class ApiGateway {
  get = async (path) => {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dto = await response.json();
    return dto;
  };
  
  post = async (path, payload) => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dto = await response.json();
    return dto;
  };
}
