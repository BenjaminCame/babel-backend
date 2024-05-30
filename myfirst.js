
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

    if (method === 'GET'){
        handelGetRequests(url).then(response => {
            console.log("this is my response   " + response)
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
    //TODO this is working in the current form, but how can i dynamically add a table from the application
    if (parsedURL === "/addtable"){
        temp = await createTable()
        return temp
    }

    if (parsedURL === "/addphrase"){
        temp = await createPhrase()
    }

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

async function getTable(table){
    console.log("get table")
    client = await pool.connect()
    var ans = await client.query('SELECT * FROM ' + table)
    console.log("after")
    client.release()
    console.log("this is ans", ans)
    return ans;
}   

async function createTable(tablename){
    client = await pool.connect()
    console.log("NODE js createTable")
    await client.query('CREATE TABLE' + tablename)//this is psudo sql query 
    client.release()
}

async function createPhrase(table, native, target){
    client = await pool.connect()
    console.log("adding" + native + target + " to " + tabel)
    await client.query("INSERT INTO" + tablename + " VALUES (" + natve + "," + target + ")")
    client.release()
}


