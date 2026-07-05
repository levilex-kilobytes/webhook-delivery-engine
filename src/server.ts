import app from "./app";
import workerService from "./services/workerService";

const PORT = process.env.PORT || 3000;

workerService.start();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
