const express = require('express');
const app = express();

const session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'password',
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    rolling: true
}))
// NƠI ĐẶT res.locals.user
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
})

const path = require('path');

require('dotenv').config();
const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));



const inventoryRouter = require('./router/inventory');

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use('/pokemon', inventoryRouter);

app.get("/", (req, res) => {
  res.redirect("/pokemon");
});

app.listen(port, (error) => {
    if (error) {
        throw error;
    }
    console.log(`My first Express app - listening on : http://localhost:${port}/pokemon`);
})