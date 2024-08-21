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
    handelGetRequests(url).then(response => {
        res.set(resheaders);
        res.json(response.rows)
        res.end()
    })
    .catch(error => {
        console.error('ERROR! ' + error)
    })
})

// TODO currently accepts all paths for post requests
app.post('*', (req, res) => { 
    const { headers, method, url } = req;
    console.log(url)
    handelPostRequests(url,req).then(response => {
        res.set(resheaders);
        // res.json(response.rows)
        res.end()
    })
    .catch(error => {
        console.error('ERROR! ' + error)
    })
})

app.delete('*',(req,res) => {
    const { headers, method, url } = req;
    handelDeleteRequests(url,req).then(response => {
        res.set(resheaders);
        res.end()
    })
    .catch(error => {
        console.error('ERROR! ' + error)
    })
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//TODO need to clean up if staments to simplicity, potentially more pythonic methods
async function handelGetRequests (parsedURL) {

    splitURLList = parsedURL.toString().split("/")

    if (parsedURL === "/getTables"){
        temp = await getDatabase()
        return temp
    }

    if (splitURLList[1] === "getlanguagephrases"){
        temp = await getTable(splitURLList[2])
        return temp
    }
}

async function handelDeleteRequests(url,req){
    splitURLList = url.toString().split("/")
    console.log(splitURLList)
    if (splitURLList[1] === "deletelang"){
        deleteLang(splitURLList[2])
    }
}


async function handelPostRequests (url, req) {
    console.log(url)
    if (url === "/newLangauage"){
        return createLanguageDB(req.body.newLanguage) // TODO error handel this funciton call
    }

    if (url === "/add/phrase"){
        let body = req.body;
        temp = await createPhrase(body.language, body.newNative, body.newTarget) //TODO need to return a success/failure repsonse
        return
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
    client = await pool.connect()
    res = await client.query("CREATE TABLE " + tablename +  " (native varchar(255), target varchar(255));")
    console.log("hello", res)
    client.release()
}  

async function createPhrase(table, native, target){
    console.log(table,native,target)
    client = await pool.connect()
    await client.query("INSERT INTO " + table + " VALUES ('" + native + "','" + target + "');")
    client.release()
}

async function deleteLang(language){
    client = await pool.connect()
    await client.query("DROP TABLE " + language)
    client.release()
}