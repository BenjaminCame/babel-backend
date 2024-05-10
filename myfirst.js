
var pg = require('pg')
var http = require('http');
const { error } = require('console');
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const { Client } = pg


const bensServer = http.createServer((request, res) => {
    const { headers, method, url } = request;

    if (method === 'GET'){
        handelGetRequests(url).then(response => {
            // response.setHeader('200',CONTENT_TYPE_JSON)
            console.log("this is my response   " + response)
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
    if (parsedURL === "/japanese"){
        console.log("successgully passed handel request")
        temp = await getTable("japanese")
        return temp.rows[0]
        // console.log("yoyoyo this got called" + temp)
    } else {
        console.log("nothing to see here!!")
    }
}

async function getTable(table){
    console.log("get table")
    const client = new Client ({ //TODO need to create a client each time i call this function, not cleanest method... will refactor
        host: 'localhost', 
        port: 5432,
        username: 'polygot',
        database: 'babel'
    })
    client.connect()//TODO im sure i can refactor this so i dont need to open a client to the postgres server everytime
    var ans = await client.query('SELECT * FROM ' + table)
    client.end()
    console.log(ans.rows[0])
    return ans;
}   

async function connectSQL() {

    client.connect()
    var test = await client.query('SELECT * FROM japanese, svenska, espanol;')
    console.log(test.rows[0])

    var temp = await client.query('SELECT * FROM svenska')
    console.log(temp.rows[0])

}

