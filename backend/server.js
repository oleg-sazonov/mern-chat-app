import { bootstrap } from "./app.js";

// Bootstrap and start the application
const server = await bootstrap();

// Export for testing or external use
export default server.app;
