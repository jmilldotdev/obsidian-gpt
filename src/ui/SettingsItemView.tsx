import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppContext, SettingsContext } from "src/context";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE_MODEL_SETTINGS, GPTPluginSettings } from "../types";
import GPTPlugin from "main";

import StopSequenceInput from "src/ui/StopSequenceInput";
import { refetchModels } from "src/openrouter";

const SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const { settings } = plugin;
  const [state, setState] = React.useState(settings.openRouter);
  const [availableModels, setAvailableModels] = React.useState(
    settings.availableModels
  );

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    if (parseFloat(value) || value === "0") {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    settings.openRouter = {
      ...settings.openRouter,
      [name]: value,
    };
    await plugin.saveSettings();
  };

  const onStopSequenceChange = async (stopSequences: string[]) => {
    setState((prevState) => ({
      ...prevState,
      stop: stopSequences,
    }));
    settings.openRouter.stop = stopSequences;
    await plugin.saveSettings();
  };

  const refetchModelState = async () => {
    const models = await refetchModels();
    settings.availableModels = models;
    await plugin.saveSettings();
    setAvailableModels(models);
  };

  return (
    <form>
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginBottom: "10px" }} htmlFor="model">
            Selected Model:
          </label>
          <button onClick={refetchModelState} type="button">
            Refetch Models
          </button>
        </div>
        <select
          name="model"
          id="model"
          value={state.model}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%" }}
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ marginBottom: "10px" }} htmlFor="max_tokens">
            Max Tokens:
          </label>
          <label style={{ textAlign: "right" }}>{state.max_tokens}</label>
        </div>
        <input
          style={{ display: "block", width: "100%" }}
          type="range"
          name="max_tokens"
          id="max_tokens"
          value={state.max_tokens}
          onChange={handleInputChange}
          min="1"
          max="2048"
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ marginBottom: "10px" }} htmlFor="temperature">
            Temperature:
          </label>
          <label style={{ textAlign: "right" }}>{state.temperature}</label>
        </div>
        <input
          style={{ display: "block", width: "100%" }}
          type="range"
          name="temperature"
          id="temperature"
          value={state.temperature}
          onChange={handleInputChange}
          min="0"
          max="2"
          step="0.01"
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ marginBottom: "10px" }} htmlFor="top_p">
            Top P:
          </label>
          <label style={{ textAlign: "right" }}>{state.top_p}</label>
        </div>
        <input
          style={{ display: "block", width: "100%" }}
          type="range"
          name="top_p"
          id="top_p"
          value={state.top_p}
          onChange={handleInputChange}
          min="0"
          max="1"
          step="0.01"
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ marginBottom: "10px" }} htmlFor="frequency_penalty">
            Frequency Penalty:
          </label>
          <label style={{ textAlign: "right" }}>
            {state.frequency_penalty}
          </label>
        </div>
        <input
          style={{ display: "block", width: "100%" }}
          type="range"
          name="frequency_penalty"
          id="frequency_penalty"
          value={state.frequency_penalty}
          onChange={handleInputChange}
          min="-2"
          max="2"
          step="0.01"
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ marginBottom: "10px" }} htmlFor="presence_penalty">
            Presence Penalty:
          </label>
          <label style={{ textAlign: "right" }}>{state.presence_penalty}</label>
        </div>
        <input
          style={{ display: "block", width: "100%" }}
          type="range"
          name="presence_penalty"
          id="presence_penalty"
          value={state.presence_penalty}
          onChange={handleInputChange}
          min="-2"
          max="2"
          step="0.01"
        />
        <br />
        <StopSequenceInput
          stopSequences={state.stop}
          onChange={onStopSequenceChange}
        />
      </div>
    </form>
  );
};

export default class SettingsItemView extends ItemView {
  settings: GPTPluginSettings;
  plugin: GPTPlugin;
  constructor(
    leaf: WorkspaceLeaf,
    settings: GPTPluginSettings,
    plugin: GPTPlugin
  ) {
    super(leaf);
    this.settings = settings;
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_MODEL_SETTINGS;
  }

  getDisplayText(): string {
    return "GPT Model Settings";
  }

  getIcon(): string {
    return "check-small";
  }

  async onOpen(): Promise<void> {
    ReactDOM.render(
      <AppContext.Provider value={this.app}>
        <SettingsContext.Provider value={this.settings}>
          <div className="obsidian-gpt">
            <SettingsForm plugin={this.plugin} />
          </div>
        </SettingsContext.Provider>
      </AppContext.Provider>,
      this.containerEl.children[1]
    );
  }
}
