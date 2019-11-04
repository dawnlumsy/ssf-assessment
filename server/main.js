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
const SEARCH_BY_TITLE_AUTHORS = `select book_id, title, authors, rating from book2018 where title like ? or authors like ? limit ? offset ?`;
const GET_BOOKCOUNT = `select count(*) as count from book2018 where title like ? or authors like ?`;
const GET_BOOK_BY_BOOK_ID = `select * from book2018 where book_id = ?`;


// 
const getSearch = mkQuery(SEARCH_BY_TITLE_AUTHORS, pool);
const getBookCount = mkQuery(GET_BOOKCOUNT, pool);

const getBookByBookid = mkQuery(GET_BOOK_BY_BOOK_ID,pool);



const app = express();
app.use(cors());
app.use(morgan('combine'));

// Routes
app.get('/api/book/:book_id', 
    (req, resp) => {
        console.info("inside book_id");
        const book_id = req.params.book_id;

        getBookByBookid([ book_id ])
            .then(result => {
                const r = result[0];
                console.info(result[0]);
                const book = {
                    book_id: r.book_id,
                    title: r.title,
                    authors: r.authors.split("|"),
                    description: r.description,
                    edition: r.edition,
                    format: r.format,
                    pages: r.pages,
                    rating: r.rating,
                    rating_count: r.rating_count,
                    review_count: r.review_count,
                    genres: r.genres.split("|"),
                    image_url: r.image_url
                }
                
                resp.status(200).json({
                    data: book,
                    timestamp: new Date().getTime()
                });
            })
            .catch(err => {
                resp.status(500).json( { message: JSON.stringify(err) } )
            })
    }
);


app.get('/api/search', (req, resp) => {
    console.info("inside search");

    const terms = req.query.terms;
    const limit = parseInt(req.query.limit) || 10;
    const offset = 0;
    console.info("Please work enter>>> ", req.query.offset);
    if (!req.query.offset) {
        console.info("successfully enter");
        const offset = parseInt(req.query.offset) || 0;
    }

    if (!terms) {
        resp.status(400).type('application/json')
            .json({ message: 'Bad request missing term' });
        return;
    }
    console.info("terms: ", terms);
    console.info("limit: ", limit);
    //console.info("offset: ", offset);
    const p0 = getSearch([`%${terms}%`, `%${terms}%`, limit, offset])
    const p1 = getBookCount([`%${terms}%`, `%${terms}%`])

    Promise.all([ p0, p1 ])
        .then(results => {
            const r0 = results[0];
            const r1 = results[1];
            
            const bookSummary = r0.map(v => {
                return bookSum = {
                    book_id: v.book_id,
                    title: v.title,
                    authors: v.authors.split("|"),
                    rating: v.rating
                }
            })
            //console.info("bookSummary:", bookSummary);
            console.info('>r0 =', r0);            
            console.info('>r1 =', r1);
            const bookResponse = {
                data: bookSummary,
                terms: terms,
                timestamp: new Date().getTime(),
                total: r1[0].count,
                limit: limit,
                offset: offset
            }

            resp.status(200).json(
                bookResponse
            )
        })
        .catch ( err => {
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


app.get('api/book/:book_id/review', 
    (req, resp) => {
        console.info("external API: get book review");
        const book_id = parseInt(req.params.book_id);
        console.info("book_id: ", req.params.book_id);           
        /*
        headers: {
            'Accept': 'application/json'
        }
        params: {
            isbn: 
            title: 
            author: 
        }*/


})

app.use(express.static(__dirname + '/public'));


app.use((req, resp) => {
    resp.status(404).type('application/JSON').json({ message: `Not Found ${req.originalUrl}` })
});

// Start the server
app.listen(PORT, () => {
    console.info(`Application started at port ${PORT} on ${new Date()}`)
});
