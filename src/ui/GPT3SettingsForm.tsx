import * as React from "react";
// import StopSequenceInput from "src/ui/StopSequenceInput";

import { GPT3ModelType } from "../models/gpt3";
import GPTPlugin from "../../main";

const GPT3SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const { gpt3 } = plugin.settings.models;
  const [state, setState] = React.useState(gpt3.settings);

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    if (parseFloat(value) || value === "0") {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    gpt3.settings = {
      ...gpt3.settings,
      [name]: value,
    };
    await plugin.saveSettings();
  };

  const onStopSequenceChange = async (stopSequences: string[]) => {
    setState((prevState) => ({
      ...prevState,
      stop: stopSequences,
    }));
    gpt3.settings.stop = stopSequences;
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
        <option value={GPT3ModelType.Ada}>Ada</option>
        <option value={GPT3ModelType.Babbage}>Babbage</option>
        <option value={GPT3ModelType.Curie}>Curie</option>
        <option value={GPT3ModelType.TextDaVinci}>Text-Davinci</option>
        <option value={GPT3ModelType.DaVinci}>Davinci</option>
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
      {/* <StopSequenceInput
        stopSequences={state.stop}
        onChange={onStopSequenceChange}
      /> */}
    </form>
  );
};

export default GPT3SettingsForm;
