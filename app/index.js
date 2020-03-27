const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

const bc = new Blockchain();
const p2pServer = new P2pServer(bc);
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

app.listen(HTTP_PORT, () => console.log("Listening on port " + `${HTTP_PORT}`));
p2pServer.listen();

app.use(bodyParser.json());

//API endpoints
app.get("/", (req, res) => {
    res.send("This is the landing page for the pancho API!");
})

app.get("/blockchain", (req, res) => {
    res.json(bc);
})

app.post("/mine", (req, res) => {
    const minedBlock = bc.addBlock(req.body.data);
    console.log("A new block was mined and added to the blockchain!");

    p2pServer.broadcastChain();

    res.redirect("/blockchain");
})