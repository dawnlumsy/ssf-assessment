// Load Libraries
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql');
const mkQuery = require('./dbutil');

// Env Variables
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
const pool = mysql.createPool(require('./config'));

// Queries
const SEARCH_BY_TITLE_AUTHORS = `select book_id, title, authors, rating from book2018 where title like ? or authors like ? limit ?`;
const GET_BOOKCOUNT = `select count(*) as count from book2018 where title like ? or authors like ?`;
const GET_BOOK_BY_BOOK_ID
// 
const getSearch = mkQuery(SEARCH_BY_TITLE_AUTHORS, pool);
const getBookCount = mkQuery(GET_BOOKCOUNT, pool);
const getBookByBookid = mkQuery(GET_BOOK_BY_BOOK_ID,pool);



const app = express();
app.use(cors());
app.use(morgan('combine'));

// Routes
app.use('/api/count', (req, resp) => {
    console.info("inside API Count book");
    const terms = req.query.terms;

        getBookCount([`%${terms}%`, `%${terms}%`])
        .then(result => {
            resp.status(200).json(result)
            }
        )
        .catch(err => {
            resp.status(500).json({ status: '500', message: JSON.stringify(err), timestamp: new Date() })
        })
    }
);


app.get('/api/search', (req, resp) => {
    console.info("inside search");

    const terms = req.query.terms;
    const limit = parseInt(req.query.limit) || 10;
    //const offset = parseInt(req.query.offset) || 0;
    //const offset = 0;

    if (!terms) {
        resp.status(400).type('application/json')
            .json({ message: 'Bad request missing term' });
        return;

    }
    console.info("terms: ", terms);
    console.info("limit: ", limit);
    //console.info("offset: ", offset);

    

    getSearch([`%${terms}%`, `%${terms}%`, limit, offset])
        .then(result => {
            //console.info(result);
            const bookSummary = result.map(v => {
                return bookSum = {
                    book_id: v.book_id,
                    title: v.title,
                    authors: v.authors.split("|"),
                    rating: v.rating
                }
            })
            console.info("bookSummary:", bookSummary);
            //console.info("diedie");
            const bookResponse = {
                data: bookSummary,
                terms: terms,
                timestamp: new Date().getTime(),
                length: 123,
                limit: limit,
                offset: offset
            }
            //console.info("bookResponse:", bookResponse);
            resp.status(200).json(bookResponse);
        })
        .catch(err => {
            resp.status(500).json({ status: '500', message: JSON.stringify(err), timestamp: new Date() })
        })
});

app.get('/api/book/:book_id', 
    (req, resp) => {
        console.info("inside book_id API");
        const book_id = parseInt(req.params.book_id);
        console.info("book_id: ", req.params.book_id);        

        getBookByBookid([ book_id ])
            .then(result => {
                resp.status(200).json(result);
            })
            .catch(err => {
                resp.status(500).json({ status: '500', message: JSON.stringify(err), timestamp: new Date() })
            })
    }
)

app.use(express.static(__dirname + '/public'));


app.use((req, resp) => {
    resp.status(404).type('application/JSON').json({ message: `Not Found ${req.originalUrl}` })
});

// Start the server
app.listen(PORT, () => {
    console.info(`Application started at port ${PORT} on ${new Date()}`)
});
