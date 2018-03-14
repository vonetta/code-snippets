"use strict"

const IntakeForm = require('../models/intake.form')
const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    read: read,
    readById: readById,
    create: create,
    update: update,
    delete: _delete,
    readByUserIdAndTherapistId: _readByUserIdAndTherapistId
}

function _readByUserIdAndTherapistId(id, therapistId) {
    return conn.db().collection('intakeForms').findOne({ userId: new ObjectId(id), therapistId: new ObjectId(therapistId), dateDeactivated: null })
        .then(intakeForm => {
            intakeForm._id = intakeForm._id.toString()
            intakeForm.userId = intakeForm.userId.toString()
            intakeForm.therapistId = intakeForm.therapistId.toString()

            for (let i = 0; i < intakeForm.traumaTypeIds.length; i++) {
                const typeIds = intakeForm.traumaTypeIds
                typeIds[i] = typeIds[i].toString()

            }
            return intakeForm
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function read() {
    return conn.db().collection('intakeForms').find({ dateDeactivated: null }).toArray()
        .then(intakeForms => {
            for (let j = 0; j < intakeForms.length; j++) {
                const intakeForm = intakeForms[j];
                intakeForm._id = intakeForm._id.toString()
                intakeForm.userId = intakeForm.userId.toString()
                intakeForm.therapistId = intakeForm.therapistId.toString()

                for (let i = 0; i < intakeForm.traumaTypeIds.length; i++) {
                    const x = intakeForm.traumaTypeIds
                    x[i] = x[i].toString()
                }
            }
            return intakeForms
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}


function readById(id) {
    return conn.db().collection('intakeForms').findOne({ _id: new ObjectId(id), dateDeactivated: null })
        .then(intakeForm => {
            intakeForm._id = intakeForm._id.toString()
            intakeForm.userId = intakeForm.userId.toString()
            intakeForm.therapistId = intakeForm.therapistId.toString()

            for (let i = 0; i < intakeForm.traumaTypeIds.length; i++) {
                const typeIds = intakeForm.traumaTypeIds
                typeIds[i] = typeIds[i].toString()

            }
            return intakeForm
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}


function create(model) {

    let traumaTypeIdsStringList = []
    let formTypeIds = model.traumaTypeIds
    for (let i = 0; i < formTypeIds.length; i++) {
        traumaTypeIdsStringList.push(new ObjectId(formTypeIds[i]))
    }

    const safeDoc = {
        _id: new ObjectId(model._id),
        userId: new ObjectId(model.userId),
        therapistId: new ObjectId(model.therapistId),
        traumaTypeIds: traumaTypeIdsStringList,
        insuranceProvider: model.insuranceProvider,
        currentPlace: model.currentPlace,
        history: model.history,
        traumaDate: model.traumaDate,
        dateCreated: new Date(),
        dateDeactivated: null,
        dateModified: new Date()

    }

    return conn.db().collection('intakeForms').insertOne(safeDoc)
        .then(result => result.insertedId.toString())
    console.log(result.insertedId)

        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function update(id, model) {
    let traumaTypeIdsStringList = []
    let formTypeIds = model.traumaTypeIds
    for (let i = 0; i < formTypeIds.length; i++) {
        traumaTypeIdsStringList.push(new ObjectId(formTypeIds[i]))
    }

    const safeDoc = {
        _id: new ObjectId(model._id),
        userId: new ObjectId(model.userId),
        therapistId: new ObjectId(model.therapistId),
        traumaTypeIds: traumaTypeIdsStringList,
        insuranceProvider: model.insuranceProvider,
        currentPlace: model.currentPlace,
        history: model.history,
        traumaDate: model.traumaDate,
        dateModified: new Date()
    }


    return conn.db().collection('intakeForms').updateOne({ _id: new ObjectId(id) }, { $set: safeDoc })
        .then(result => { console.log(result); return result.matchedCount })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _delete(id) {

    return conn.db().collection('intakeForms').updateOne({ _id: new ObjectId(id) }, { $set: { dateDeactivated: new Date(), dateModified: new Date() } })
        .then(result => { console.log(result); return result.matchedCount })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}