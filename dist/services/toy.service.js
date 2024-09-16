"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toyService = void 0;
const mongodb_1 = require("mongodb");
const logger_service_1 = require("./logger.service");
const db_service_1 = require("./db.service");
exports.toyService = {
    query,
    getById,
    remove,
    add,
    update,
};
const toysCollectionName = process.env.TOYS_COLLECTION_NAME;
async function query(filterBy, sortBy = {}) {
    logger_service_1.logger.debug('Querying toys');
    try {
        const filterCriteria = _getFilterCriteria(filterBy);
        const collection = await _getToysCollection();
        let toys = await collection.find(filterCriteria).sort(sortBy).toArray();
        return toys;
    }
    catch (err) {
        throw err;
    }
}
async function getById(toyId) {
    logger_service_1.logger.debug(`Fetching toy with ID: ${toyId}`);
    try {
        const collection = await _getToysCollection();
        const toy = collection.findOne({ _id: new mongodb_1.ObjectId(toyId) });
        return toy;
    }
    catch (err) {
        throw err;
    }
}
async function remove(toyId) {
    logger_service_1.logger.debug(`Removing toy with ID: ${toyId}`);
    try {
        const collection = await _getToysCollection();
        await collection.deleteOne({ _id: new mongodb_1.ObjectId(toyId) });
    }
    catch (err) {
        throw err;
    }
}
async function add(toy) {
    logger_service_1.logger.debug('Adding new toy:', toy);
    try {
        const collection = await _getToysCollection();
        const { insertedId } = await collection.insertOne(toy);
        toy.createdAt = insertedId.getTimestamp().getTime();
        await collection.updateOne({ _id: new mongodb_1.ObjectId(insertedId) }, { $set: toy });
        return toy;
    }
    catch (err) {
        throw err;
    }
}
async function update(toy) {
    logger_service_1.logger.debug(`Updating toy with ID: ${toy._id}`);
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            labels: [...toy.labels],
        };
        const collection = await _getToysCollection();
        await collection.updateOne({ _id: new mongodb_1.ObjectId(toy._id) }, { $set: toyToSave });
        return toy;
    }
    catch (err) {
        throw err;
    }
}
////////////////////////////////////////////////////
// ! Private Methods
async function _getToysCollection() {
    return await db_service_1.dbService.getCollection(toysCollectionName);
}
function _getFilterCriteria(filterBy) {
    if (!filterBy)
        return {};
    const filterCriteria = {};
    const { name, inStock, maxPrice, labels } = filterBy;
    if (name)
        filterCriteria.name = { $regex: name, $options: 'i' };
    if (inStock !== null)
        filterCriteria.inStock = inStock;
    if (maxPrice)
        filterCriteria.price = { $lte: +maxPrice };
    if (labels.length)
        filterCriteria.labels = { $all: labels };
    return filterCriteria;
}
