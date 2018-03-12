;
(function() {
    "use strict"

    angular.module("client.main.pages.journalEvents")
        .controller("journalCreateController", JournalCreateController)

    JournalCreateController.$inject = [
        "journalsEventsService",
        "$log",
        "$stateParams",
        "$state",
        "$window",
        'summernoteToolbar',
        "uiNotificationsService"
    ]

    function JournalCreateController(
        journalsEventsService,
        $log,
        $stateParams,
        $state,
        $window,
        summernoteToolbar,
        uiNotificationsService
    ) {
        const vm = this
        vm.formData = {}
        vm.traumaData = {}
        vm.buttonText = "Submit"
        vm.summernote = summernoteToolbar

        vm.formData.emotionalTags = []
        vm.formData.physicalTags = []
        vm.formData.triggerTags = []
        vm.formData.socialTags = []
        vm.formData.comments = []
        vm.formData.users = []

        vm.valid = isValid
        vm.postOrEdit = _postOrEdit
        vm.create = _createEntry
        vm.readById = _readById
        vm.update = _update

        vm.addButton = addButton
        vm.removeButton = removeButton

        vm.journalsEventsService = journalsEventsService

        vm.$onInit = $init

        function $init() {
            if ($stateParams.id) {
                journalsEventsService
                    .readById($stateParams.id)
                    .then(data => {
                        vm.formData = data.item
                        vm.buttonText = "Edit"
                    })
                    .catch(data => $log.log(`Error: ${data.errors}`))
            }

        }

        vm.options = { maxDate: "now" }

        function isValid(x) {
            return vm.journalForm.$submitted && vm.journalForm[x].$error.required
        }

        function removeButton(x, index) {
            vm.formData[x].splice(index, 1)
        }

        function addButton(x) {
            vm.formData[x].push({})
        }

        function _postOrEdit() {
            const id = vm.formData.id
            if (vm.journalForm.$invalid) {
                return
            } else if ($stateParams.id) {
                _update()
            } else {
                _createEntry()
            }
        }

        function _createEntry() {
            journalsEventsService
                .create(vm.formData)
                .then(data => {
                    uiNotificationsService.success("Journal event successfully created.")
                    vm.formData._id = data.item
                    $state.go("main.journalsEvents.list")
                })
                .catch(data =>
                    uiNotificationsService.error('An error occurred while attempting to create the journal event.')
                )
        }

        function _readById(id) {
            journalsEventsService
                .readById(id)
                .then(data => {
                    vm.formData = data.item
                })
                .catch(data =>
                    uiNotificationsService.error('An error occurred while attempting to retrieve the journal event.')
                )
        }

        function _update() {
            journalsEventsService
                .update(vm.formData._id, vm.formData)
                .then(data => {
                    uiNotificationsService.success("Journal event successfully updated.")
                    $state.go("main.journalsEvents.list")
                })
                .catch(data => uiNotificationsService.error('An error occurred while attempting to update the journal event.'))
        }
    }
})();
(function() {
    angular.module("client.main.pages.journalEvents").component("journalDetail", {
        templateUrl: "client/main/pages/journal.events/details/journal.events.form.html",
        controller: "journalCreateController",
        bindings: {
            traumaTypes: "<",
            users: "<"
        }
    })
})()
