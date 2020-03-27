const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const mongoose = require('mongoose');

//connect to the db
mongoose.connect('mongodb://localhost:27017/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

//create db schema
const ticketSchema = new mongoose.Schema({
    name: String,
    problem: String,

});

//create virtual param id for schemea from mongo _id for vue/express to use
ticketSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });

//show virtual ids in json    
ticketSchema.set('toJSON', {
    virtuals: true
});

// create a model for tickets
const Ticket = mongoose.model('Ticket', ticketSchema);

//now some crud rest api endpoints

//read
app.get('/api/tickets', async (req, res) => {
    try {
        let tickets = await Ticket.find();
        res.send({tickets: tickets});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}); 

//create
app.post('/api/tickets', async (req, res) => {
    const ticket = new Ticket({
        name: req.body.name,
        problem: req.body.problem
    });
    try {
        await ticket.save();
        res.send({ticket: ticket});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//delete
app.delete('/api/tickets/:id', async (req, res) => {
    try {
        await Ticket.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

