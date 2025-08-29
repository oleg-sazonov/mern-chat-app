/**
 * apiRequest Utility
 * ------------------
 * A reusable utility function for making API requests.
 *
 * Exports:
 *   - apiRequest: Handles HTTP requests with JSON payloads and error handling.
 *
 * Parameters:
 *   - url (string): The endpoint URL for the API request.
 *   - method (string): The HTTP method (e.g., "GET", "POST", "PUT", "DELETE").
 *   - body (object): The request payload (optional, defaults to `undefined`).
 *
 * Returns:
 *   - (object): The parsed JSON response from the API.
 *
 * Throws:
 *   - An error if the response status is not OK (status code >= 400).
 *   - The error message is extracted from the response or defaults to "Request failed".
 *
 * Usage:
 *   - Used throughout the application for making API calls.
 *
 * Example:
 *   - Sending a POST request:
 *       const data = await apiRequest("/api/auth/login", "POST", {
 *           username: "johndoe",
 *           password: "password123",
 *       });
 *
 *   - Handling errors:
 *       try {
 *           const data = await apiRequest("/api/messages", "GET");
 *           console.log(data);
 *       } catch (error) {
 *           console.error("API request failed:", error.message);
 *       }
 */

export const apiRequest = async (url, method, body) => {
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers, body: JSON.stringify(body) };

    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
};
