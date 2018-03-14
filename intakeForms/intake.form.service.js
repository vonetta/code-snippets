const axios = require('axios')

function read() {
    return $http.get('/api/intake-forms')
        .then(xhrSuccess)
        .catch(onError)
}

function readById(id) {
    return $http.get(`/api/intake-forms/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function create(intakeData) {
    return axios.post('/api/intake-forms', intakeData)
        .then(xhrSuccess)
        .catch(onError)
}

function update(intakeFormData) {
    return $http.put(`/api/intake-forms/${intakeFormData._id}`, intakeFormData)
        .then(xhrSuccess)
        .catch(onError)
}

function _delete(id) {
    return $http.delete(`/api/intake-forms/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}
function readByTreatmentInvitationId(id) {
    return axios.get(`/api/treatment-invitations/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function readTraumaTypes() {
    return axios.get('/api/trauma-types')
        .then(xhrSuccess)
        .catch(onError)
}

function xhrSuccess(response) {
    return response.data
}

function onError(error) {
    console.log(error.data)
    return Promise.reject(error.data)
}

function _readByUserIdAndTherapistId(id) {
    return axios.get(`/api/intake-forms/users/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

module.exports = {
    read: read,
    create: create,
    readByTreatmentInvitationId: readByTreatmentInvitationId,
    readById: readById,
    readTraumaTypes: readTraumaTypes,
    update: update,
    delete: _delete,
    readByUserIdAndTherapistId: _readByUserIdAndTherapistId
}