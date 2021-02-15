import { app } from './api/server';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`\n=== SERVER LISTENING ON ${port} ===\n`);
});
