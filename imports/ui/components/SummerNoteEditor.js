import React, {Component} from 'react';

export default class SummerNoteEditor extends Component {

  componentDidMount() {
    const
      {
        height = 200,
        placeholder = "write your article...",
        content = "<p>write your article ...</p>"
      } = this.props,
      editor = this.refs.summernote
      ;
    $(editor).summernote({
      height,
      placeholder
    });
    $(editor).summernote('editor.pasteHTML', content);
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
    const
      {
        content = ""
      } = this.props
      ;
    return (
      <div className="summernote" ref="summernote">
      </div>
    );
  }
}