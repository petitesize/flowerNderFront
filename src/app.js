const express = require('express');
const path = require("path");
const app = express();

app.use(express.json());
app.use('/', express.static(path.join(process.cwd(), 'src', 'views')));
// /member/info.html

app.use('/public', express.static(path.join(process.cwd(), 'public')));
// /public/css/admin.css

const PORT = 8080;

app.listen(PORT, () => {
    console.log('express app listen', PORT);
});