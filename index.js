const mysql   = require('mysql');
const express = require('express');
const app     = express();

// ---------------------------------
// - Init the MySQL
// ---------------------------------

/*const pool = mysql.createPool({

    connectionLimit: 100,
    host:           "localhost",
    user:           "root",
    password:       "2009",
    database:       "scan_result_db",
    debug:           false

});*/

const connection = mysql.createConnection({

    host:           "localhost",
    user:           "root",
    password:       "2009",
    database:       "scan_result_db"

});

connection.connect((err) => {

    if (err) 
    {
        console.dir(`MySQL connection error: ${err}`);
        throw err;
    }

});
app.use(express.json());

// ---------------------------------
// - Init the GET
// ---------------------------------

app.get('/scan-result', ( req, res ) => {

        connection.query(

            `SELECT * FROM scan`,
            (err, result, fields) => {

                if ( fields) console.dir(`readAll::fields: ${fields}`);
                if ( result )
                {
                    console.dir(`readAll::pool: ${result}`);
                    res.json(result);
                }

                if ( err )
                {
                    console.dir(`readAll::err: ${err}`);
                    res.json([]);
                }

            }

        );
    });

// ---------------------------------
// - Init the POST scan-result route
// ---------------------------------

app.post(

    '/scan-result', ( req, res ) => {

        const body = req.body;
        let rowAmount = 0;
        connection.query(

            `INSERT INTO scan (json) VALUES (${JSON.stringify(body.scan)})`,
            (err, rows) => {

                if ( err ) console.log(`Database error`);
                rowAmount = rows;
                console.log(`Query result: ${rows}`);
            }

        );
        
        console.log(`Body scan: ${body.scan}`);
    res.send(`Body: ${JSON.stringify(body)}, rows from inserted: ${rowAmount}`);

});

app.listen(3000);

// ----------------------
// - Middleware functions
// ----------------------

function insertScan(scanBody)
{

        connection.query(

            `INSERT INTO scan (json) VALUES (${JSON.stringify(scanBody.scan)})`,
            (err, rows) => {

                if ( err ) return false;

                return rows;
            }

        );

}

/**
 * Retrieves a newly added row
 * 
 * @param {SQLResult} result 
 */
function insertResult(result)
{

    if (result === 1)
    {
        const last_insert_id =
        pool.query(`SELECT LAST_INSERT_ID()`);

        if ( last_insert_id )
        {
            response =
            connection.query(

                `SELECT * FROM scan WHERE id = ${last_insert_id}`,
                (err, rows) => {

                    if ( err ) return [];

                    return rows;
                }

            );
        }
    }

    return [];
}

/**
 * Read all -- default GET response
 */
function readAll()
{

    connection.query(

        `SELECT * FROM scan`,
        (err, result, fields) => {

            if ( fields) console.dir(`readAll::fields: ${fields}`);
            if ( result )
            {
                console.dir(`readAll::pool: ${result}`);
                return result;
            }

            if ( err )
            {
                console.dir(`readAll::err: ${err}`);
                return [];
            }

        }

    );

    return [];
}