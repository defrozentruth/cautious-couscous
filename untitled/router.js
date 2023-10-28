import express from 'express';
import body_parser from "body-parser";
import fs from "fs";
let router = express.Router();
router.use(body_parser.json({limit: '50mb'}));
router.use(body_parser.urlencoded({limit: '50mb', extended: true}));
router.use(express.json());

let data = fs.readFileSync('./public/json/lib.json', 'utf-8');
let book_json = JSON.parse(data);

router.get('/', (req, res) => {
    res.render('index', {title: 'Библиотека.онлайн'});
});

router.get('/library', (req, res) => {
    res.render('library', {title: 'Библиотека.онлайн', books: book_json});
});

router.get('/library/:id', (req, res) => {
    const id = req.params.id;

    if (id === 'no_filter') {
        let array = [];
        for(let obj of book_json){
            array.push(obj.id)
        }
        res.end(JSON.stringify(array));
        return;
    }
    if (id === 'in_stock') {
        let array = [];
        for(let obj of book_json){
            if (obj.in_stock === "нет")
                array.push(obj.id)
        }
        res.end(JSON.stringify(array));
        return;
    }
    if (id === 'overdue') {
        let array = [];
        let cur_date = new Date();
        for(let obj of book_json){
            let obj_date = new Date(obj.date_return)
            if (obj_date > cur_date || obj.in_stock == "да") {
                array.push(obj.id);
            }
        }
        res.end(JSON.stringify(array));
        return;
    }
});

router.post('/book/edit/:id', (req, res) => {
    let id = req.params.id;

    for (let value of book_json){
        if (value.id == id){
            value.title = req.body.title;
            value.author = req.body.author;
            value.date = req.body.date;
            res.redirect('/book/'+id);
            return;
        }
    }
});

router.post('/book/delete/:id', (req, res) => {
    let id = req.params.id;
    for(let i = 0; book_json.length; i++){
        if(book_json[i].id == id) {
            book_json.splice(i, 1);
            res.redirect('/library');
            return;
        }
    }
});

router.post('/book/new', (req, res) => {
    book_json.push({
        "id": book_json.length,
        "title": req.body.title,
        "author": req.body.author,
        "date": req.body.date,
        "in_stock": "да",
        "reader": "-",
        "date_return": "-"
    });
    res.redirect('/library');
});

router.post('/book/take/:id', (req, res) => {
    const id = req.params.id;
    let cur_date = new Date();
    cur_date.setDate(cur_date.getDate() + 30);

    for (let value of book_json){
        if (value.id == id){
            value.reader = req.body.reader;
            value.date_return = cur_date;
            value.in_stock = "нет";
            res.redirect('/book/'+id);
            return;
        }
    }
});

router.post('/book/return/:id', (req, res) => {
    const id = req.params.id;

    for (let value of book_json){
        if (value.id == id){
            value.reader = '-';
            value.date_return = '-';
            value.in_stock = "да";
            res.redirect('/book/'+id);
            return;
        }
    }
});

router.get('/book/:id', (req, res) => {
    const id = req.params.id;

    for (let value of book_json) {
        if (value.id == id) {
            res.render('book', {
                page_title: 'Библиотека.онлайн', ID: `${value.id}`, title: `${value.title}`,
                author: `${value.author}`, date: `${value.date}`, in_stock: `${value.in_stock}`,
                reader: `${value.reader}`, return_date: `${value.date_return}`
            });
            return;
        }
    }
});

router.get("*", (req, res) => {
    res.status(404);
    res.end("Page not found")
});

export {router};