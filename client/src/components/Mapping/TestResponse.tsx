import React from 'react';
import { responseMapping } from 'api-mapping';
import { Button } from 'reactstrap';
import ButtonModal from './ButtonModal';
import AceEditor from 'react-ace';
import { stringIsValidJSON } from '../../helpers/util';
import JSONBox from '../JSONBox';

interface IProps {
  responseMapping: any;
  disabled: boolean;
}

interface IState {
  editorHeadersValue: string;
  editorBodyValue: string;
  mappingOutput: object | undefined;
}

class TestResponse extends React.Component<IProps, IState> {
  public state: IState = {
    editorHeadersValue: '{\n    \n}',
    editorBodyValue: '{\n    \n}',
    mappingOutput: undefined,
  };

  public onChangeEditorHeaders = (value: string, event: any) => {
    this.setState({
      editorHeadersValue: value,
    });
  };
  public onChangeEditorBody = (value: string, event: any) => {
    this.setState({
      editorBodyValue: value,
    });
  };

  public runResponseMapping = () => {
    if (!this.props.responseMapping) {
      alert('There is some error with your mapping!');
      return;
    }

    const input = {
      headers: JSON.parse(this.state.editorHeadersValue),
      body: JSON.parse(this.state.editorBodyValue),
    };
    const mappingOutput = responseMapping(input, this.props.responseMapping);
    this.setState({ mappingOutput });
  };

  public render() {
    const runMappingDisabled = !(
      stringIsValidJSON(this.state.editorHeadersValue) &&
      stringIsValidJSON(this.state.editorBodyValue)
    );
    const { mappingOutput } = this.state;
    return (
      <ButtonModal
        triggerType="button"
        modalTitle="Test your Response mapping"
        btnTitle="Test your Response mapping"
        btnColor="info"
        disabled={this.props.disabled}
        tooltip={
          this.props.disabled
            ? 'Make sure your response mappings are valid or filled in properly!'
            : 'Test your response mapping with data'
        }
      >
        <h5>Enter a sample API response:</h5>
        Headers + general:
        <br />
        <AceEditor
          name="editor-headers-test-response"
          mode="json"
          theme="tomorrow"
          onChange={this.onChangeEditorHeaders}
          fontSize={14}
          editorProps={{ $blockScrolling: true }}
          value={this.state.editorHeadersValue}
          style={{ border: '1px solid lightgrey' }}
          width="auto"
          height="100px"
        />
        <br />
        Body:
        <br />
        <AceEditor
          name="editor-body-test-response"
          mode="json"
          theme="tomorrow"
          onChange={this.onChangeEditorBody}
          fontSize={14}
          editorProps={{ $blockScrolling: true }}
          value={this.state.editorBodyValue}
          style={{ border: '1px solid lightgrey' }}
          width="auto"
          height="400px"
        />
        <br />
        <Button
          color="primary"
          onClick={this.runResponseMapping}
          disabled={runMappingDisabled}
          title={
            runMappingDisabled
              ? 'Make sure your input is valid JSON'
              : 'Run your response mapping with the provided data'
          }
        >
          Run your mapping!
        </Button>
        {mappingOutput && (
          <div>
            <hr />
            <h5>Mapping output:</h5>
            <JSONBox object={mappingOutput} />
          </div>
        )}
      </ButtonModal>
    );
  }
}

export default TestResponse;
