"use strict"

const React = require("react")
const DateTime = require("react-datetime")
const IntakeFormService = require("../../services/intake.form.service")
const Select = require('react-select').default


class IntakeForm extends React.PureComponent {
    constructor(props, context) {
        super(props, context)

        this.state = {
            formData: {
                therapistId: "",
                insuranceProvider: "",
                history: "",
                traumaDate: "",
                currentPlace: "",
                traumaTypeIds: ""
            },
            submitted: false,
            traumaList: []
        }

        this.submit = this.submit.bind(this)
        this.handleTraumaDateInputChange = this.handleTraumaDateInputChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.validityCheck = this.validityCheck.bind(this)
        this.handleTraumaChange = this.handleTraumaChange.bind(this)
    }

    componentDidMount() {
        IntakeFormService.readByTreatmentInvitationId(this.props.urlParams.id)
            .then(data => {
                this.setState((prevState) => {
                    const newFormData = Object.assign({}, prevState.formData)
                    newFormData.therapistId = data.item.userId
                    return {
                        formData: newFormData
                    }
                })
            })

        IntakeFormService.readTraumaTypes()
            .then(data => {
                this.setState({ traumaList: data.items })
            })
    }

    handleTraumaDateInputChange(event) {
        const target = event._d
        const name = target.name
        this.setState((prevState) => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData.traumaDate = target
            return {
                formData: newFormData
            }
        })
    }

    handleChange(e) {
        const target = e.target
        const value = target.value
        const name = target.name

        this.setState((prevState) => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData[name] = value
            return {
                formData: newFormData
            }
        })
    }

    handleTraumaChange(traumaTypeIds) {
        traumaTypeIds = traumaTypeIds.map(trauma => {
            return trauma.value
        })

        this.setState((prevState) => {
            const newFormData = Object.assign({}, prevState.formData)
            newFormData.traumaTypeIds = traumaTypeIds
            return {
                formData: newFormData
            }
        })
    }

    validityCheck(propertyName) {
        return (this.state.submitted && this[propertyName] && !this[propertyName].validity.valid ? 'has-error has-feedback' : '')
    }

    submit(event) {
        this.setState({ submitted: true })
        IntakeFormService.create(this.state.formData)
            .then(data => this.props.angularUrl("/my-supporters"))
            .catch(data => alert("There was a problem submitting your request"))
    }

    render() {
        return (
            <div>
                <div className="panel panel-inverse">
                    <div className="panel-heading">
                        <h4 className="panel-title">Intake Form</h4>
                    </div>
                    <div className="panel-body">
                        <form ref={ref => (this.formElement = ref)} id="formElement">

                            <div className={"form-group " + this.validityCheck('insuranceProviderElement')}>
                                <label htmlFor="insuranceProvider" className="control-label">Insurance Provider</label>
                                <input type="text" name="insuranceProvider" id="insuranceProvider" maxLength="100" className="form-control" value={this.state.formData.insuranceProvider} ref={ref => (this.insuranceProviderElement = ref)} placeholder="Enter text" onChange={this.handleChange} required />
                                <span className="fa fa-times form-control-feedback"></span>
                                {this.state.submitted && this.insuranceProviderElement && this.insuranceProviderElement.validity.valueMissing && (
                                    <p className="help-block">Insurance Provider is required</p>)}

                                {this.state.submitted && this.insuranceProviderElement &&
                                    this.insuranceProviderElement.validity.tooLong && (<p className="help-block"> insurance Provider must be 100 characters or less </p>)}
                            </div>

                            <div className={"form-group " + this.validityCheck('historyElement')}>
                                <label htmlFor="history" className="control-label">
                                    History (Explain the conditions you have previously and/or are
                                    currently experiencing)
                </label>
                                <input type="textarea" maxLength="2000" name="history" id="history" className="form-control"
                                    value={this.state.formData.history} ref={ref => (this.historyElement = ref)} placeholder="Enter text" onChange={this.handleChange} required />
                                <span className="fa fa-times form-control-feedback"></span>
                                {this.state.submitted && this.historyElement && this.historyElement.validity.valueMissing && (
                                    <p className="help-block">History is required</p>)}

                                {this.state.submitted && this.historyElement && this.historyElement.validity.tooLong && (
                                    <p className="help-block">  History must be 2000 characters or less  </p>)}
                            </div>

                            <div className="form-group">
                                <label htmlFor="traumaDate" className="control-label input-group">
                                    Trauma Date (optional)
                  <div className="input-group date">
                                        <DateTime mode="date" name="traumaDate" id="traumaDate" timeFormat={false} value={this.state.formData.traumaDate} placeholder="Enter text"
                                            onChange={this.handleTraumaDateInputChange} inputProps={{ readOnly: true, ref: (input) => { this.input = input; } }} closeOnSelect={true} />
                                        <span className="input-group-addon" onClick={() => { this.input.focus() }}>
                                            <i className="glyphicon glyphicon-calendar" />
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div className={"form-group " + this.validityCheck('currentPlaceElement')}>
                                <label htmlFor="currentPlace" className="control-label">
                                    Where are you now in your recovery?
                </label>
                                <input type="text" maxLength="1000" name="currentPlace" id="currentPlace" ref={ref => (this.currentPlaceElement = ref)}
                                    className="form-control" value={this.state.formData.currentPlace} placeholder="Enter Text" onChange={this.handleChange} required />
                                <span className="fa fa-times form-control-feedback"></span>
                                {this.state.submitted && this.currentPlaceElement && this.currentPlaceElement.validity.valueMissing && (<p className="help-block">Current place is required</p>)}

                                {this.state.submitted && this.currentPlaceElement && this.currentPlaceElement.validity.tooLong && (
                                    <p className="help-block">  Current place must be 1000 characters or less </p>)}
                            </div>

                            <div className="form-group">
                                <label htmlFor="traumaTypeIds" className="control-label">Trauma Types</label>

                                <Select multi={true} ref={ref => (this.traumaTypeIdsElement = ref)} name="traumaTypeIds" id="traumaTypeIds" value={this.state.formData.traumaTypeIds} onChange={this.handleTraumaChange} options=
                                    {this.state.traumaList.map(function (trauma) {
                                        return { value: trauma._id, label: trauma.name }
                                    })} placeholder="Please select your traumas"
                                />
                            </div>

                            <div className="form-group">
                                <button
                                    type="button"
                                    className="btn btn-success pull-right"
                                    onClick={this.submit}>
                                    Create
                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = IntakeForm
