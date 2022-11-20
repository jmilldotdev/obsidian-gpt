import * as React from "react";
// import StopSequenceInput from "src/ui/StopSequenceInput";

import { AI21ModelType } from "../models/ai21";
import GPTPlugin from "../../main";

const AI21SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const { ai21 } = plugin.settings.models;
  const [state, setState] = React.useState(ai21.settings);

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    if (parseFloat(value) || value === "0") {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    ai21.settings = {
      ...ai21.settings,
      [name]: value,
    };
    await plugin.saveSettings();
  };

  const onStopSequenceChange = async (stopSequences: string[]) => {
    setState((prevState) => ({
      ...prevState,
      stop: stopSequences,
    }));
    ai21.settings.stop = stopSequences;
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
        <option value={AI21ModelType.Jurassic1Large}>J-1 Large</option>
        <option value={AI21ModelType.Jurassic1Jumbo}>J-1 Jumbo</option>
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
      {/* <StopSequenceInput
        stopSequences={state.stop}
        onChange={onStopSequenceChange}
      /> */}
    </form>
  );
};

export default AI21SettingsForm;
