import React, {Component} from 'react';

export default class SummerNoteEditor extends Component {

  componentDidMount() {
    const
      {height} = this.props,
      editor = this.refs.summernote
      ;
    $(editor).summernote({
      height
    });
  }

  componentWillUnmount() {
    const editor = this.refs.summernote;
    $(editor).summernote("destroy");
  }

  getContent() {
    const editor = this.refs.summernote;
    return $(editor).summernote("code");
  }

  render() {
    return (
      <div className="summernote" ref="summernote">
        Hello Summernote
      </div>
    );
  }
}