"use strict"

const responses = require("../models/responses")
const journalsEventsService = require("../services/journal.events.service")
const sanitizeHtmlService = require('../services/sanitize.html.service')
let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix
    return {
        read: _readAll,
        readById: _readById,
        create: _create,
        update: _update,
        deactivate: _deactivate,
        readMyJournal: _readMyJournal,
        readByUserId: _readByUserId
    }
}

function _readAll(req, res) {
    journalsEventsService
        .read()
        .then(response => {
            const responseModel = new responses.ItemsResponse()
            responseModel.item = response
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _create(req, res) {
    req.model.userId = req.auth.userId
    req.model.contentHtml = sanitizeHtmlService.cleanHtml(req.model.contentHtml)
    journalsEventsService.create(req.model)
        .then(response => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = response

            res
                .status(201)
                .location(`${_apiPrefix}/${response._id}`)
                .json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _readById(req, res) {
    journalsEventsService
        .readById(req.params.id)
        .then(journal => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = journal
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _update(req, res) {
    req.model.contentHtml = sanitizeHtmlService.cleanHtml(req.model.contentHtml)
    journalsEventsService
        .update(req.params.id, req.model)
        .then(journal => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _deactivate(req, res) {
    journalsEventsService
        .deactivate(req.params.id)
        .then(journal => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _readMyJournal(req, res) {
    journalsEventsService.readMyJournal(req.auth.userId)
        .then(journal => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = journal
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _readByUserId(req, res) {
    journalsEventsService.readByUserId(req.params.userId, req.auth.userId)
        .then(journal => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = journal
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}