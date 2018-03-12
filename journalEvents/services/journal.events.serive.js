"use strict"

const Journal = require("../models/journal.event")
const mongodb = require("../mongodb")
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    read: _readAll,
    readById: _readById,
    readByUserId: _readByUserId,
    create: _create,
    update: _update,
    deactivate: _deactivate,
    readMyJournal: _readMyJournal
}

function _readAll() {
    return conn.db().collection("journalEvents").find({ dataDeactivated: null }).toArray()
        .then(journals => {
            for (let i = 0; i < journals.length; i++) {
                let journal = journals[i]
                journal._id = journal._id.toString()
                journal.userId = journal.userId.toString()

                array("traumaTypeIds")
                array("viewerIds")

                function array(propertyName) {
                    // NOTE: This function is still able to reference 'i'
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j] = id[j].toString()
                    }
                }

                tagLoop("emotionalTags")
                tagLoop("physicalTags")
                tagLoop("triggerTags")
                tagLoop("socialTags")

                function tagLoop(propertyName) {
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j].id = id[j].id.toString()
                    }
                }

                comments(i)

                function comments(i) {
                    for (let j = 0; j < journals[i].comments.length; j++) {
                        let id = journals[i].comments
                        id[j].userId = id[j].userId.toString()
                    }
                }
            }
            return journals
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}
//grab id from arrays and push the ids in new array
function _create(model) {
    const safeDoc = {
        userId: new ObjectId(model.userId),
        dateCreated: new Date(),
        dateModified: new Date(),
        eventDate: model.eventDate,
        title: model.title,
        contentHtml: model.contentHtml,
        traumaTypeIds: [],
        emotionalTags: [],
        physicalTags: [],
        triggerTags: [],
        socialTags: [],
        viewerIds: [],
        comments: [],
        isVisibleToCurrentSupporters: model.isVisibleToCurrentSupporters
    }

    for (let i = 0; i < model.comments.length; i++) {
        safeDoc.comments[i] = {
            dateCreated: model.comments[i].dateCreated,
            content: model.comments[i].content,
            userId: new ObjectId(model.comments[i].userId)
        }
    }

    arrayLoop("traumaTypeIds")
    arrayLoop("viewerIds")

    function arrayLoop(propertyName) {
        for (let i = 0; i < model[propertyName].length; i++) {
            safeDoc[propertyName][i] = new ObjectId(model[propertyName][i])
        }
    }

    processTags("physicalTags")
    processTags("socialTags")
    processTags("triggerTags")
    processTags("emotionalTags")

    function processTags(tagName) {
        for (let i = 0; i < model[tagName].length; i++) {
            safeDoc[tagName][i] = {
                id: new ObjectId(model[tagName][i].id),
                severity: model[tagName][i].severity
            }
        }
    }

    return conn.db().collection("journalEvents").insertOne(safeDoc)
        .then(result => {
            return { _id: result.insertedId.toString(), userId: result.ops[0].userId, dateCreated: result.ops[0].dateCreated, dateModified: result.ops[0].dateModified }
        }) //"return" generated Id as string
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
}

function _readById(id) {
    return conn.db().collection("journalEvents").findOne({ _id: new ObjectId(id) }, { dataDeactivated: null })
        .then(journal => {
            journal._id = journal._id.toString()
            journal.userId = journal.userId.toString()

            array("traumaTypeIds")
            array("viewerIds")

            function array(propertyName) {
                for (let j = 0; j < journal[propertyName].length; j++) {
                    let id = journal[propertyName]
                    id[j] = id[j].toString()
                }
            }

            tagLoop("emotionalTags")
            tagLoop("physicalTags")
            tagLoop("triggerTags")
            tagLoop("socialTags")

            function tagLoop(propertyName) {
                for (let j = 0; j < journal[propertyName].length; j++) {
                    let id = journal[propertyName]
                    id[j].id = id[j].id.toString()
                }
            }

            comments()

            function comments() {
                for (let j = 0; j < journal.comments.length; j++) {
                    let id = journal.comments
                    id[j].userId = id[j].userId.toString()

                }
            }

            return journal
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _readByUserId(id, currentUserId) {
    return conn.db().collection("journalEvents").find({
        userId: new ObjectId(id),
        dataDeactivated: null,
        $or: [
            { isVisibleToCurrentSupporters: true },
            { viewerIds: new ObjectId(id) },
            { userId: new ObjectId(currentUserId) }
        ]
    }).toArray()
        .then(journals => {
            for (let i = 0; i < journals.length; i++) {
                let journal = journals[i]
                journal._id = journal._id.toString()
                journal.userId = journal.userId.toString()

                array("traumaTypeIds")
                array("viewerIds")

                function array(propertyName) {
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j] = id[j].toString()
                    }
                }

                tagLoop("emotionalTags")
                tagLoop("physicalTags")
                tagLoop("triggerTags")
                tagLoop("socialTags")

                function tagLoop(propertyName) {
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j].id = id[j].id.toString()
                    }
                }

                comments(i)

                function comments(i) {
                    for (let j = 0; j < journals[i].comments.length; j++) {
                        let id = journals[i].comments
                        id[j].userId = id[j].userId.toString()


                    }
                }
            }

            return journals
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _update(id, model) {
    const safeDoc = {
        $set: {
            _id: new ObjectId(model._id),
            dateModified: new Date(),
            eventDate: model.eventDate,
            title: model.title,
            contentHtml: model.contentHtml,
            traumaTypeIds: [],
            emotionalTags: [],
            physicalTags: [],
            triggerTags: [],
            socialTags: [],
            viewerIds: [],
            comments: [],
            isVisibleToCurrentSupporters: model.isVisibleToCurrentSupporters
        }
    }

    arrayLoop("traumaTypeIds")
    arrayLoop("viewerIds")
    arrayLoop("comments")

    function arrayLoop(propertyName) {
        for (let i = 0; i < model[propertyName].length; i++) {
            safeDoc.$set[propertyName][i] = model[propertyName][i]
        }
    }

    processTags("physicalTags")
    processTags("socialTags")
    processTags("triggerTags")
    processTags("emotionalTags")

    function processTags(tagName) {
        for (let i = 0; i < model[tagName].length; i++) {
            safeDoc.$set[tagName][i] = {
                id: new ObjectId(model[tagName][i].id),
                severity: model[tagName][i].severity
            }
        }
    }

    return conn.db().collection("journalEvents").updateOne({ _id: new ObjectId(id), dateDeactivated: null }, safeDoc)
        .then(result => {
            return result.matchedCount
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _deactivate(id) {
    const safeDoc = {
        $set: {
            dateModified: new Date(),
            dataDeactivated: new Date()
        }
    }

    return conn.db().collection("journalEvents").updateOne({ _id: new ObjectId(id) }, safeDoc)
        .then(result => {
            return result.matchedCount
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function _readMyJournal(id) {
    return conn.db().collection("journalEvents").find({ userId: new ObjectId(id), dataDeactivated: null }).toArray()
        .then(journals => {
            for (let i = 0; i < journals.length; i++) {
                let journal = journals[i]
                journal._id = journal._id.toString()
                journal.userId = journal.userId.toString()

                array("traumaTypeIds")
                array("viewerIds")

                function array(propertyName) {
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j] = id[j].toString()
                    }
                }

                tagLoop("emotionalTags")
                tagLoop("physicalTags")
                tagLoop("triggerTags")
                tagLoop("socialTags")

                function tagLoop(propertyName) {
                    for (let j = 0; j < journals[i][propertyName].length; j++) {
                        let id = journals[i][propertyName]
                        id[j].id = id[j].id.toString()
                    }
                }

                comments(i)

                function comments(i) {
                    for (let j = 0; j < journals[i].comments.length; j++) {
                        let id = journals[i].comments
                        id[j].userId = id[j].userId.toString()
                    }
                }
            }
            return journals

        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}