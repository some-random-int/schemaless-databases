/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * order-domain
 * This is a API-Documentation for the order-domain. It serves as a data-contract.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: frederick.behringer@smail.inf.h-brs.de
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as url from "url";
import * as isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "http://localhost:5001".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration?: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name = "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface Order
 */
export interface Order {
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    key?: string;
    /**
     * 
     * @type {Date}
     * @memberof Order
     */
    orderDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Order
     */
    shipDate?: Date;
    /**
     * Order priority
     * @type {string}
     * @memberof Order
     */
    orderPriority?: Order.OrderPriorityEnum;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    region?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    country?: string;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    unitsSold?: number;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    totalCost?: number;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    totalRevenue?: number;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    totalProfit?: number;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    itemID?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    supplierID?: string;
}

/**
 * @export
 * @namespace Order
 */
export namespace Order {
    /**
     * @export
     * @enum {string}
     */
    export enum OrderPriorityEnum {
        H = <any> 'H',
        M = <any> 'M',
        L = <any> 'L',
        C = <any> 'C'
    }
}
/**
 * OrderApi - fetch parameter creator
 * @export
 */
export const OrderApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * analyses the orders
         * @summary analyses the orders
         * @param {string} [aggregator] After what should be grouped
         * @param {string} [aggregated] Which parameter is subject of the aggregation operator
         * @param {string} [operator] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        analyseOrders(supplierID: string, aggregator?: string, aggregated?: string, operator?: string, options: any = {}): FetchArgs {
            const localVarPath = `/api/orders/{supplierID}`
                .replace(`{${"supplierID"}}`, encodeURIComponent(String(supplierID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (aggregator !== undefined) {
                localVarQueryParameter['aggregator'] = aggregator;
            }

            if (aggregated !== undefined) {
                localVarQueryParameter['aggregated'] = aggregated;
            }

            if (operator !== undefined) {
                localVarQueryParameter['operator'] = operator;
            }

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Create a new order
         * @summary Create a new order
         * @param {Order} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrder(body: Order, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createOrder.');
            }
            const localVarPath = `/api/order`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"Order" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get an existing order
         * @summary Get an existing order
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrder(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling getOrder.');
            }
            const localVarPath = `/api/order/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get orders by itemID
         * @summary Get orders by itemID
         * @param {string} itemID ID of referenced item from Supplier-Domain
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrdersByItemID(itemID: string, options: any = {}): FetchArgs {
            // verify required parameter 'itemID' is not null or undefined
            if (itemID === null || itemID === undefined) {
                throw new RequiredError('itemID','Required parameter itemID was null or undefined when calling getOrdersByItemID.');
            }
            const localVarPath = `/api/orders/items/{itemID}`
                .replace(`{${"itemID"}}`, encodeURIComponent(String(itemID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Update an existing order
         * @summary Update an existing order
         * @param {Order} body 
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateOrder(body: Order, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling updateOrder.');
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling updateOrder.');
            }
            const localVarPath = `/api/order/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"Order" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * OrderApi - functional programming interface
 * @export
 */
export const OrderApiFp = function(configuration?: Configuration) {
    return {
        /**
         * analyses the orders
         * @summary analyses the orders
         * @param {string} [aggregator] After what should be grouped
         * @param {string} [aggregated] Which parameter is subject of the aggregation operator
         * @param {string} [operator] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        analyseOrders(supplierID: string, aggregator?: string, aggregated?: string, operator?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
            const localVarFetchArgs = OrderApiFetchParamCreator(configuration).analyseOrders(supplierID, aggregator, aggregated, operator, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * Create a new order
         * @summary Create a new order
         * @param {Order} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrder(body: Order, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
            const localVarFetchArgs = OrderApiFetchParamCreator(configuration).createOrder(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * Get an existing order
         * @summary Get an existing order
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrder(id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Order> {
            const localVarFetchArgs = OrderApiFetchParamCreator(configuration).getOrder(id, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * Get orders by itemID
         * @summary Get orders by itemID
         * @param {string} itemID ID of referenced item from Supplier-Domain
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrdersByItemID(itemID: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Order>> {
            const localVarFetchArgs = OrderApiFetchParamCreator(configuration).getOrdersByItemID(itemID, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * Update an existing order
         * @summary Update an existing order
         * @param {Order} body 
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateOrder(body: Order, id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
            const localVarFetchArgs = OrderApiFetchParamCreator(configuration).updateOrder(body, id, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
            };
        },
    }
};

/**
 * OrderApi - factory interface
 * @export
 */
export const OrderApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * analyses the orders
         * @summary analyses the orders
         * @param {string} [aggregator] After what should be grouped
         * @param {string} [aggregated] Which parameter is subject of the aggregation operator
         * @param {string} [operator] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        analyseOrders(supplierID: string, aggregator?: string, aggregated?: string, operator?: string, options?: any) {
            return OrderApiFp(configuration).analyseOrders(supplierID, aggregator, aggregated, operator, options)(fetch, basePath);
        },
        /**
         * Create a new order
         * @summary Create a new order
         * @param {Order} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrder(body: Order, options?: any) {
            return OrderApiFp(configuration).createOrder(body, options)(fetch, basePath);
        },
        /**
         * Get an existing order
         * @summary Get an existing order
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrder(id: string, options?: any) {
            return OrderApiFp(configuration).getOrder(id, options)(fetch, basePath);
        },
        /**
         * Get orders by itemID
         * @summary Get orders by itemID
         * @param {string} itemID ID of referenced item from Supplier-Domain
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getOrdersByItemID(itemID: string, options?: any) {
            return OrderApiFp(configuration).getOrdersByItemID(itemID, options)(fetch, basePath);
        },
        /**
         * Update an existing order
         * @summary Update an existing order
         * @param {Order} body 
         * @param {string} id ID of order
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateOrder(body: Order, id: string, options?: any) {
            return OrderApiFp(configuration).updateOrder(body, id, options)(fetch, basePath);
        },
    };
};

/**
 * OrderApi - object-oriented interface
 * @export
 * @class OrderApi
 * @extends {BaseAPI}
 */
export class OrderApi extends BaseAPI {
    /**
     * analyses the orders
     * @summary analyses the orders
     * @param {string} [aggregator] After what should be grouped
     * @param {string} [aggregated] Which parameter is subject of the aggregation operator
     * @param {string} [operator] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrderApi
     */
    public analyseOrders(supplierID: string, aggregator?: string, aggregated?: string, operator?: string, options?: any) {
        return OrderApiFp(this.configuration).analyseOrders(supplierID, aggregator, aggregated, operator, options)(this.fetch, this.basePath);
    }

    /**
     * Create a new order
     * @summary Create a new order
     * @param {Order} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrderApi
     */
    public createOrder(body: Order, options?: any) {
        return OrderApiFp(this.configuration).createOrder(body, options)(this.fetch, this.basePath);
    }

    /**
     * Get an existing order
     * @summary Get an existing order
     * @param {string} id ID of order
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrderApi
     */
    public getOrder(id: string, options?: any) {
        return OrderApiFp(this.configuration).getOrder(id, options)(this.fetch, this.basePath);
    }

    /**
     * Get orders by itemID
     * @summary Get orders by itemID
     * @param {string} itemID ID of referenced item from Supplier-Domain
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrderApi
     */
    public getOrdersByItemID(itemID: string, options?: any) {
        return OrderApiFp(this.configuration).getOrdersByItemID(itemID, options)(this.fetch, this.basePath);
    }

    /**
     * Update an existing order
     * @summary Update an existing order
     * @param {Order} body 
     * @param {string} id ID of order
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OrderApi
     */
    public updateOrder(body: Order, id: string, options?: any) {
        return OrderApiFp(this.configuration).updateOrder(body, id, options)(this.fetch, this.basePath);
    }

}
