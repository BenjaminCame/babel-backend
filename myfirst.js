
var pg = require('pg')
var http = require('http');
var url = require('url');
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const { get } = require('https');
const { parse } = require('path');
const { Client } = pg
const client = new Client ({
    host: 'localhost', 
    port: 5432,
    username: 'polygot',
    database: 'babel'
})
CacheStorage

const bensServer = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    
    //handel requests
    if (req.method === 'GET'){
        handelGetRequests(req, res, parsedURL)
    }
});

bensServer.on("request", (req, res) => {
    console.log(req);
    res.write("got request!!!")
    res.end()
})
bensServer.on('connection', connection =>{
    console.log("someone just connected")
})
bensServer.listen(8080, ()=>console.log("listening on 8080"))


async function handelGetRequests = (req, res, parsedURL) => {
    console.log("this is req" + req)
    console.log("this is res" + res)
    if (parsedURL.path === "/japanese"){
        req = await getTable(req, "japanese")
        console.log(res)
        // var temp = await client.query('SELECT * FROM japanese')
        // console.log(temp)
        // res.write(temp.rows[0])
        sendResponse(res, 200, CONTENT_TYPE_JSON, temp);
        console.log("yoyoyo this got called" + temp)
    } else {
        console.log("nothing to see here!!")
    }
}

const sendResponse = (res, statusCode, contentType, data) => {
    res.writeHead(statusCode, contentType);
    res.end(JSON.stringify(data));
};

async function getTable(res, table){
    res = await client.query('SELECT * FROM' + table)
    console.log("select * from ${table}")
    console.log("yoyoyo this got called" + res.rows[0])

}   

async function connectSQL() {

    client.connect()

    var test = await client.query('SELECT * FROM japanese, svenska, espanol;')
    console.log(test.rows[0])

    var temp = await client.query('SELECT * FROM svenska')
    console.log(temp.rows[0])

}


connectSQL()
