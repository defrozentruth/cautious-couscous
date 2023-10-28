import express from 'express'
import {router} from "./router.js"

let app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use('./public', express.static('public'));

app.use('/', router);
app.set('port', '3000');
app.listen('3000')


