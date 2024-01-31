const express = require('express');
const { aql }= require('arangojs');

async function ensureKey(req, res, next) {
    const collection = req.app.get('collection');
    if (!req.params.key) {
        res.status(400).send('Key is missing.');
        return;
    }
    if (!req.params.key.startsWith(`order/`)) {
        req.params.key = `order/` + req.params.key;
    }
    next();
}


const router = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
router.get('/order/:key', ensureKey, async (req, res) => {
    const db = req.app.get('db');
    const key = req.params.key;

    console.log(key)
    const order = await db.query(aql`
            RETURN DOCUMENT(${key})
        `);
    res.status(200).send(await order.all());
});

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
router.post('/order', async (req, res) => {
    const db = req.app.get('db');
    const collection = req.app.get('collection');
    delete req.body_key;

    const order = await db.query({ query: `
            INSERT @order
            INTO ${collection}
            RETURN NEW
        `, bindVars: { order: req.body } });
    res.status(201).send(await order.all());
});

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
router.post('/order/:key', ensureKey, async (req, res) => {
    const db = req.app.get('db');
    const collection = req.app.get('collection');
    const key = req.params.key;

    const order = await db.query({ query: `
            UPDATE @order 
            INTO ${collection}
        `, bindVars: { order: req.body } });
    res.status(201).send(await order.all());
});

// no delete operations, since we just don't allow to delete an order

module.exports = router;