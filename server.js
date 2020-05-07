const app = require('./src/app');

// FIRE UP SERVER
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is up on port ${port}`));
