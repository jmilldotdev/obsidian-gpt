import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppContext, SettingsContext } from "src/context";
import { ItemView, WorkspaceLeaf } from "obsidian";
import {
  VIEW_TYPE_MODEL_SETTINGS,
  GPTPluginSettings,
  SupportedModels,
} from "../types";
import GPTPlugin from "main";
import ChatGPTSettingsForm from "./ChatGPTSettingsForm";
import GPT3SettingsForm from "./GPT3SettingsForm";
import AI21SettingsForm from "./AI21SettingsForm";
import CohereSettingsForm from "./CohereSettingsForm";

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
        <option value={SupportedModels.CHATGPT}>ChatGPT</option>
        <option value={SupportedModels.GPT3}>GPT-3</option>
        <option value={SupportedModels.AI21}>AI21</option>
        <option value={SupportedModels.COHERE}>Cohere</option>
      </select>
      {activeModel === SupportedModels.CHATGPT && (
        <ChatGPTSettingsForm plugin={plugin} />
      )}
      {activeModel === SupportedModels.GPT3 && (
        <GPT3SettingsForm plugin={plugin} />
      )}
      {activeModel === SupportedModels.AI21 && (
        <AI21SettingsForm plugin={plugin} />
      )}
      {activeModel === SupportedModels.COHERE && (
        <CohereSettingsForm plugin={plugin} />
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
