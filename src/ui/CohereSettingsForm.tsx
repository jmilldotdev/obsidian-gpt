import * as React from "react";
import StopSequenceInput from "src/ui/StopSequenceInput";

import { CohereModelType } from "../models/cohere";
import GPTPlugin from "../../main";

const CohereSettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const { cohere } = plugin.settings.models;
  const [state, setState] = React.useState(cohere.settings);

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    if (parseFloat(value) || value === "0") {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    cohere.settings = {
      ...cohere.settings,
      [name]: value,
    };
    await plugin.saveSettings();
  };

  const onStopSequenceChange = async (stopSequences: string[]) => {
    setState((prevState) => ({
      ...prevState,
      stop: stopSequences,
    }));
    cohere.settings.stopSequences = stopSequences;
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
        <option value={CohereModelType.Small}>Small</option>
        <option value={CohereModelType.Medium}>Medium</option>
        <option value={CohereModelType.Large}>Large</option>
        <option value={CohereModelType.XLarge}>X-Large</option>
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
        max="5"
      />
      <br />
      <label htmlFor="modelName">p:</label>
      <input
        type="number"
        name="p"
        id="p"
        value={state.p}
        onChange={handleInputChange}
        min="0"
        max="1"
      />
      <br />
      <label htmlFor="modelName">k:</label>
      <input
        type="number"
        name="k"
        id="k"
        value={state.k}
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
      <StopSequenceInput
        stopSequences={state.stopSequences}
        onChange={onStopSequenceChange}
      />
    </form>
  );
};

export default CohereSettingsForm;
