import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import config from "./src/config/config.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
