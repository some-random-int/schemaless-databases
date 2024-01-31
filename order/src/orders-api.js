const express = require('express');
const { aql }= require('arangojs');



const router = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
router.get('/orders/:supplierID', async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = req.app.get('collection');

        const supplierID = req.params.supplierID;
        const aggregator = req.query.aggregator || 'country';
        let aggregated = req.query.aggregated || 'revenue';
        const operator = req.query.operator || 'COUNT';
        const limit = req.query.limit || 250;

        const allowedAggregators = [ 'country', 'itemID', 'salesChannel', 'orderPriority', 'orderDate', 'shipDate' ];
        if (!allowedAggregators.includes(aggregator)) {
            res.status(400).send('Unknown aggregator! Choose from the following: ' + allowedAggregators.join());
            return;
        }
        const allowedOperators = [ 'COUNT', 'AVG', 'MIN', 'MAX', 'SUM' ];
        if (!allowedOperators.includes(operator)) {
            res.status(400).send('Unknown operator! Choose from the following: ' + allowedOperators.join());
            return;
        }

        var query = [ `FOR order IN ${collection}` ];
        query.push(`FILTER order.supplierID == "${supplierID}"`);
        // query.push(`LIMIT ${limit}`);
        query.push(`COLLECT ${aggregator} = order.${aggregator}`);

        // count is special. We don't need aggregated in this case
        if (operator === 'COUNT') {
            query.push('WITH COUNT INTO frequency');
            aggregated = 'frequency';
        } else {
            switch (aggregated) {
                case 'unitsSold':
                case 'totalCost':
                case 'totalProfit':
                case 'totalRevenue':
                    query.push(`AGGREGATE ${aggregated} = ${operator}(order.${aggregated})`);
                    break;
                // case 'orderDate':
                // case 'shipDate':
                //     query.push(`AGGREGATE ${aggregated} = DATE_FORMAT(${operator}(DATE_TIMESTAMP(order.${aggregated})), '%dd.%mm.%yyyy')`);
                //     break;
                // case 'processDays':
                //     query.push(`AGGREGATE ${aggregated} = DATE_FORMAT(${operator}(DATE_SUBTRACT(DATE_TIMESTAMP(order.shipDate), DATE_TIMESTAMP(order.orderDate), 'd')), '%dd.%mm.%yyyy')`);
                //     break;
                default:
                    res.status(400).send('Unknown aggregated! Choose from the following: unitsSold, totalCost, totalProfit, totalRevenue, orderData, shipDate, processDays');
                    return;
            }
        }
        query.push(`SORT ${aggregator} ASC`);
        query.push(`RETURN { ${aggregator}, ${aggregated} }`);

        let queryString = query.join(' ');
        console.log(' |> ' + queryString)
        let queryResult = await db.query({ query: queryString, bindVars: { } });
        res.status(200).send(await queryResult.all());
    } catch (e) {
        res.status(500).send('We got an error!')
        console.error(e.message);
    }
});

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
router.get('/orders/items/:itemId', async (req, res) => {
    const db = req.app.get('db');
    const collection = req.app.get('collection');
    const itemId = req.params.itemId;

    if (!itemId) {
        res.status(400).send('ItemID is missing!');
        return;
    }

    const queryString = `
            FOR order IN ${collection}
                FILTER order.itemID == "${itemId}"
                SORT order.orderDate DESC
                RETURN order`;
    console.log(queryString);
    const orders = await db.query({query: queryString, bindVars: { } });
    res.status(200).send(await orders.all());
});

module.exports = router;