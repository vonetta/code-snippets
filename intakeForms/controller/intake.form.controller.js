"use strict"

const responses = require('../models/responses');
const intakeFormsService = require('../services/intake.forms.service')

let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix

    return {
        read: read,
        readById: readById,
        create: create,
        update: update,
        delete: _delete,
        readByUserIdAndTherapistId: _readByUserIdAndTherapistId
    }
}

function _readByUserIdAndTherapistId(req, res) {
    intakeFormsService.readByUserIdAndTherapistId(req.params.id, req.auth.userId)
        .then(intakeForm => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = intakeForm
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function read(req, res) {
    intakeFormsService.read()
        .then(intakeForms => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = intakeForms
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function readById(req, res) {

    intakeFormsService.readById(req.params.id)
        .then(intakeForm => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = intakeForm
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function create(req, res) {
    req.model.userId = req.auth.userId
    intakeFormsService.create(req.model)
        .then(id => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = id
            res.status(201)
                .location(`${_apiPrefix}/${id}`)
                .json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function update(req, res) {
    intakeFormsService
        .update(req.params.id, req.model)
        .then(intakeForm => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _delete(req, res) {
    intakeFormsService
        .delete(req.params.id)
        .then(() => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(new responses.ErrorResponse(err))
        })
}

