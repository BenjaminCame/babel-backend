
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
    if (parsedURL === "/japanese"){
        console.log("successgully passed handel request")
        temp = await getTable("japanese")
	return temp
    } else if(parsedURL === "/svenska"){
        console.log("successgully passed handel request")
        temp = await getTable("svenska")
        return temp
    } else if(parsedURL === "/espanol"){
        console.log("successgully passed handel request")
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



