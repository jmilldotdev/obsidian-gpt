import * as React from "react";

import { AI21ModelType } from "../models/ai21";
import GPTPlugin from "../../main";

const AI21SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const [state, setState] = React.useState(
    plugin.settings.models.ai21.settings
  );

  const handleInputChange = async (e: any) => {
    const { ai21 } = plugin.settings.models;
    let { name, value } = e.target;
    value = parseFloat(value) ? parseFloat(value) : value;
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
    </form>
  );
};

export default AI21SettingsForm;
