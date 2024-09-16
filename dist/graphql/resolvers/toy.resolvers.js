"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toyResolvers = void 0;
const toy_service_1 = require("../../services/toy.service");
const util_service_1 = require("../../services/util.service");
const toys = async (_, { filterBy, sortBy }) => {
    try {
        const toys = await toy_service_1.toyService.query(filterBy, sortBy);
        return toys;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed fetching toys', err);
    }
};
const toy = async (_, { _id }) => {
    try {
        const toy = await toy_service_1.toyService.getById(_id);
        return toy;
    }
    catch (err) {
        throw util_service_1.utilService.handleError(`Failed fetching toy with ID ${_id}`, err);
    }
};
const removeToy = async (_, { _id }) => {
    try {
        await toy_service_1.toyService.remove(_id);
    }
    catch (err) {
        throw util_service_1.utilService.handleError(`Failed removing toy with ID ${_id}`, err);
    }
};
const addToy = async (_, { toy }) => {
    try {
        const newToy = await toy_service_1.toyService.add(toy);
        return newToy;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed adding toy', err);
    }
};
const updateToy = async (_, { toy }) => {
    try {
        const updatedToy = await toy_service_1.toyService.update(toy);
        return updatedToy;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed updating toy', err);
    }
};
exports.toyResolvers = {
    Query: {
        toys,
        toy,
    },
    Mutation: {
        removeToy,
        addToy,
        updateToy,
    },
};
