import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppContext, SettingsContext } from "context";
import { ItemView, WorkspaceLeaf } from "obsidian";
import {
  VIEW_TYPE_MODEL_SETTINGS,
  GPTPluginSettings,
  SupportedModels,
  AI21ModelType,
  GPT3ModelType,
} from "./types";
import GPTPlugin from "main";

const GPT3SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const [state, setState] = React.useState(
    plugin.settings.modelSettings.gpt3Settings
  );

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    value = parseFloat(value) ? parseFloat(value) : value;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    plugin.settings.modelSettings.gpt3Settings = {
      ...plugin.settings.modelSettings.gpt3Settings,
      [name]: value,
    };
    await plugin.saveSettings();
    console.log(plugin.settings.modelSettings.gpt3Settings);
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
    </form>
  );
};

const AI21SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const [state, setState] = React.useState(
    plugin.settings.modelSettings.ai21Settings
  );

  const handleInputChange = async (e: any) => {
    let { name, value } = e.target;
    value = parseFloat(value) ? parseFloat(value) : value;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    plugin.settings.modelSettings.ai21Settings = {
      ...plugin.settings.modelSettings.ai21Settings,
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

const SettingsForm = ({ plugin }: { plugin: GPTPlugin }) => {
  const [activeModel, setActiveModel] = React.useState(
    plugin.settings.activeModel
  );
  return (
    <div className="settingsForm">
      <label htmlFor="">Select Model:</label>
      <select
        name="activeModel"
        id="activeModel"
        value={activeModel}
        onChange={async (e) => {
          const model = e.target.value as SupportedModels;
          setActiveModel(model);
          plugin.settings.activeModel = model;
          await plugin.saveSettings();
        }}
      >
        <option value={SupportedModels.GPT3}>GPT-3</option>
        <option value={SupportedModels.AI21}>AI21</option>
      </select>
      {activeModel === SupportedModels.GPT3 && (
        <GPT3SettingsForm plugin={plugin} />
      )}
      {activeModel === SupportedModels.AI21 && (
        <AI21SettingsForm plugin={plugin} />
      )}
    </div>
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
