import app from "./index";
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => console.log(`Local app listening on port ${port}!`));
