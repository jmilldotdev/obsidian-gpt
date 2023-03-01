import * as React from "react";
import StopSequenceInput from "src/ui/StopSequenceInput";

import GPTPlugin from "../../main";
import { ChatGPTModelType } from "src/models/chatGPT";

const ChatGPTSettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const { chatgpt } = plugin.settings.models;
  const [state, setState] = React.useState(chatgpt.settings);

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    if (parseFloat(value) || value === "0") {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    chatgpt.settings = {
      ...chatgpt.settings,
      [name]: value,
    };
    await plugin.saveSettings();
  };

  const onStopSequenceChange = async (stopSequences: string[]) => {
    setState((prevState) => ({
      ...prevState,
      stop: stopSequences,
    }));
    chatgpt.settings.stop = stopSequences;
    await plugin.saveSettings();
  };

  return (
    <form>
      <label htmlFor="modelType">Model Type:</label>
      <select
        name="modelType"
        id="modelType"
        value={state.modelType}
        onChange={handleInputChange}
      >
        <option value={ChatGPTModelType.Default}>Default</option>
      </select>
      <br />
      <label htmlFor="modelName">Max Tokens:</label>
      <input
        type="number"
        name="maxTokens"
        id="maxTokens"
        value={state.maxTokens}
        onChange={handleInputChange}
        min="1"
        max="2048"
      />
      <br />
      <label htmlFor="modelName">Temperature:</label>
      <input
        type="number"
        name="temperature"
        id="temperature"
        value={state.temperature}
        onChange={handleInputChange}
        min="0"
        max="1"
      />
      <br />
      <label htmlFor="modelName">Top P:</label>
      <input
        type="number"
        name="topP"
        id="topP"
        value={state.topP}
        onChange={handleInputChange}
        min="0"
        max="1"
      />
      <br />
      <label htmlFor="modelName">Frequency Penalty:</label>
      <input
        type="number"
        name="frequencyPenalty"
        id="frequencyPenalty"
        value={state.frequencyPenalty}
        onChange={handleInputChange}
        min="0"
        max="1"
      />
      <br />
      <label htmlFor="modelName">Presence Penalty:</label>
      <input
        type="number"
        name="presencePenalty"
        id="presencePenalty"
        value={state.presencePenalty}
        onChange={handleInputChange}
        min="0"
        max="1"
      />
      <br />
      <label htmlFor="systemMessage">System Message:</label>
      <textarea
        name="systemMessage"
        id="systemMessage"
        value={state.systemMessage}
        onChange={handleInputChange}
        rows={5}
      />
      <br />
      <StopSequenceInput
        stopSequences={state.stop}
        onChange={onStopSequenceChange}
      />
    </form>
  );
};

export default ChatGPTSettingsForm;
