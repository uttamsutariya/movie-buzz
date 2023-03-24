const app = require("./app");
const { PORT } = require("./config");
require("./utils/db").connect();

app.listen(PORT, () => console.log(`App is running on port:${PORT}`));
