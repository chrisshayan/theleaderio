import React, {Component} from 'react';

export default class CreateAliasForm extends Component {

  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  _onSubmit() {
    this.setState({
      errors: null
    });
    const inputValue = this.refs.input.value;
    if (_.isEmpty(inputValue)) {
      this.setState({
        errors: `Please enter your ${this.props.inputHolder}`
      });
    } else {
      this.props.onSubmit({inputValue});
    }
  }

  _onKeyUp() {
    console.log(this.refs.input.value);
  }

  render() {
    const {
      inputType = 'text',
      inputHolder = 'alias',
      buttonLabel = 'Create',
      errors = null
    } = this.props;

    return (
      <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
        <div className="form-group">
            <div className="input-group m-b">
              <input
                ref="input"
                type={ inputType }
                className="form-control text-right"
                placeholder={ inputHolder }
                autoFocus
                onKeyUp={() => {
                  this._onKeyUp();
                }}
              />
              <span className="input-group-addon font-bold m-t text-left">.theleader.io</span>
            </div>
        </div>
        <div className="form-group">
          {!_.isEmpty(errors) && (
            <p ref="error" className="alert-danger text-center">{errors}</p>
          )}
          {!_.isEmpty(this.state.errors) && (
            <p ref="error" className="alert-danger text-center">{this.state.errors}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary block full-width m-b">
          { buttonLabel } <i className="fa fa-arrow-right"></i>
        </button>
      </form>
    );
  }
}