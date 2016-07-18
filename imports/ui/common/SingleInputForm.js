import React, {Component} from 'react';

export default class SingleInputForm extends Component {

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
    if(_.isEmpty(inputValue)) {
      this.setState({
        errors: `Please enter your ${this.props.inputHolder}`
      });
    } else {
      this.props.onSubmit({ inputValue });
    }
  }

  render() {
    const {
      inputType = 'email',
      inputHolder = 'Email address',
      buttonLabel = 'Send new password',
      errors = null
    } = this.props;

    return (
      <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
        <div className="form-group">
          <input ref="input"
                 type={ inputType }
                 className="form-control"
                 placeholder={ inputHolder }
                 autoFocus
          />
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