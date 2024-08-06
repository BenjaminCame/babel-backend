var pg = require('pg')
const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
const port = 8080

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const resheaders = {
            'Access-Control-Allow-Origin': 'http://localhost:4200', /* @dev First, read about security */
            'Access-Control-Allow-Methods': 'POST, GET, PUT',
            'Access-Control-Max-Age': 2592000, // 30 days
            'Access-Control-Allow-Headers':'content-type Authorization',
            /** add other headers as per requirement */
          };

const { Pool } = pg

const pool = new Pool ({
    host: 'localhost', 
    port: 5432,
    user: 'postgres',
    database: 'babeldb',
    password: 'pa$$word'
})

app.get('*', (req, res) => {
    const { headers, method, url } = req;
    console.log('this is my url', url)
    handelGetRequests(url).then(response => {
        res.set(resheaders);
        res.json(response.rows)
        res.end()
    })
    .catch(error => {
        console.error('ERROR! ' + error)
    })
})

app.post('*', (req, res) => {
    const { headers, method, url } = req;
    console.log('this is my post request')
    let data = "";
    console.log("this is my body", req.body)
    // req.on('data', chunk => {
      
    //   data += chunk.toString();
    //   console.log("this is my data", data)
    // });

    if (url === "/newLangauage"){
        console.log("adding new language")
        return createLanguageDB(req.body.newLanguage) // TODO error handel this funciton call
    }
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//TODO this function needs to be cleaned up, maybe made a seperate handel POST requests function
//TODO need to clean up if staments to simplicity, potentially more pythonic methods
async function handelGetRequests (parsedURL) {
    if (parsedURL === "/getTables"){
        temp = await getDatabase()
        return temp
    }

    if (parsedURL === "/add/phrase"){
        let body = [];
        request
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();
    // at this point, `body` has the entire request body stored in it as a string
        });
        temp = await createPhrase("testnew", "native test", "target test") //TODO need to return a success/failure repsonse
        return
    }
     //TODO this is working in the current form, but how can i dynamically add a table from the application
    if (parsedURL === "/japanese"){
        temp = await getTable("japanese")
	    return temp
    } else if(parsedURL === "/svenska"){
        temp = await getTable("svenska")
        return temp
    } else if(parsedURL === "/espanol"){
        temp = await getTable("espanol")
        return temp
    } else {
        console.log("nothing to see here!!")
    }
}

async function getDatabase(){
    client = await pool.connect()
    var ans = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    client.release()
    return ans;
}

async function getTable(table){
    client = await pool.connect()
    var ans = await client.query('SELECT * FROM ' + table)
    client.release()
    return ans;
}   

async function createLanguageDB(tablename){
    console.log("this is my create language")
    client = await pool.connect()
    console.log("CREATE TABLE " + tablename +  " ( native varchar(255), target varchar(255) );")
    res = await client.query("CREATE TABLE " + tablename +  " ( native varchar(255), target varchar(255) );")
                            //CREATE TABLE tablename ( native varchar(255), target varchar(255) );
    console.log("hello", res)
    client.release()
}  

async function createPhrase(table, native, target){
    client = await pool.connect()
    await client.query("INSERT INTO " + table + " VALUES ('" + native + "','" + target + "');")
    client.release()
}
