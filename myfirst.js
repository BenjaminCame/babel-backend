
var pg = require('pg')
var http = require('http');
var cors = require('cors')
const { error } = require('console');
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const { Pool } = pg

const pool = new Pool ({
    host: 'localhost', 
    port: 5432,
    user: 'postgres',
    database: 'babeldb',
    password: 'pa$$word'
})

const bensServer = http.createServer((request, res) => {
    const { headers, method, url } = request;
    const resheaders = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
      };
    //TODO need to add a (method === POST request)
    console.log(method)
    if (method === 'GET'){
        handelGetRequests(url).then(response => {
            console.log(JSON.stringify(response.rows))
            res.writeHead(200, resheaders);
            res.write(JSON.stringify(response.rows))
            res.end()
        })
        .catch(error => {
            console.error('ERROR! ' + error)
        })

    }
});


bensServer.listen(8080, ()=>console.log("listening on 8080"))


async function handelGetRequests (parsedURL) {
    console.log(parsedURL)
    if (parsedURL === "/addtable"){
        await createTable("testnew") //TODO need to return a success/failure repsonse
        return
    }
    if (parsedURL === "/getTables"){
        console.log("hello")
        temp = await getDatabase()
        console.log(temp)
        return temp
    }

    if (parsedURL === "/add/phrase"){
        console.log("this is the test")
        let body = [];
        request
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();
    // at this point, `body` has the entire request body stored in it as a string
        });
        console.log('this is body', body)
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

async function createTable(tablename){
    client = await pool.connect()
    res = await client.query('CREATE TABLE ' + tablename +  "( native varchar(255), target varchar(255) );")
    console.log(res)
    client.release()
}

async function createPhrase(table, native, target){
    client = await pool.connect()
    await client.query("INSERT INTO " + table + " VALUES ('" + native + "','" + target + "');")
    client.release()
}


