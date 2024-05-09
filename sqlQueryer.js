import pg from 'pg';

async function connectSQL(){
    const { Client } = pg

    const client = new Client({
        host: 'localhost',
        port: 5432,
        username: 'postgres',
    })
    console.log("inside")
    await client.connect()
    await client.query( 'SELECT * FROM japanese, svenska, espanol;')
}

export {connectSQL}