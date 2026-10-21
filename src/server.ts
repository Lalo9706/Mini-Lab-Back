import { env } from "./config/env.js";
import app from "./app.js";

app.listen(env.port, () => {
  console.log(`Mini-Lab-Back API running on http://localhost:${env.port}`);
});
