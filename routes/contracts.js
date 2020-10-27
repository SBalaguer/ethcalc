'use strict';

const { Router } = require('express');
const router = new Router();
const Contract = require('../models/contracts');

router.get('/all', async (req, res, next) => {
    //lists all contacts in the db.
    //FUNCIONA OK
    try {
        const allContracts = await Contract.find().exec();
        res.json({ type: 'success', data: allContracts });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/create', async (req, res, next) => {
    const {name,contracts} = req.body;
    try {
        const newContract = await Contract.create({name,contracts});
        res.json({type: 'success', data: newContract });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.put('/update/:id', async (req, res, next) => {
    //updates an existing contract
    //need to get an id from the input
    //still to be tested
    const id = req.params.id;
    const {data} = req.body;
    try {
        const updatedContract = Contract.findByIdAndUpdate(id, data, {new:true}).exec();
        res.json({ type: 'success', updatedContract});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    //gets the contracts of a specific project
    //FUNCIONA OK
    const id = req.params.id;
    try {
        const contractData = await Contract.findById(id).exec();
        res.json({type: 'success', data: contractData});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
