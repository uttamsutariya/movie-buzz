const app = require("./app");
const PORT = process.env.PORT;
require("./config/db").connect();

app.listen(PORT, () => console.log(`App is running on port:${PORT}`));
