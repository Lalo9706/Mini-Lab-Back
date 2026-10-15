import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mini-Lab-Back API running on http://localhost:${PORT}`);
});