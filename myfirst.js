
var pg = require('pg')
var http = require('http');
const { error } = require('console');
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const { Pool } = pg

const pool = new Pool ({
    host: 'localhost', 
    port: 5432,
    username: 'polygot',
    database: 'babel'
})

const bensServer = http.createServer((request, res) => {
    const { headers, method, url } = request;

    if (method === 'GET'){
        handelGetRequests(url).then(response => {
            console.log("this is my response   " + response)
            console.log(JSON.stringify(response))
            res.write(JSON.stringify(response))
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
        return temp.rows[0]
    } else if(parsedURL === "/svenska"){
        console.log("successgully passed handel request")
        temp = await getTable("svenska")
        return temp.rows[0]
    } else if(parsedURL === "/espanol"){
        console.log("successgully passed handel request")
        temp = await getTable("espanol")
        return temp.rows[0]
    } else {
        console.log("nothing to see here!!")
    }
}

async function getTable(table){
    console.log("get table")
    client = await pool.connect()
    var ans = await client.query('SELECT * FROM ' + table)
    client.release()
    console.log(ans.rows[0])
    return ans;
}   



