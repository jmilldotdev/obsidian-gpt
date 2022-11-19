import { App } from "obsidian";
import * as React from "react";
import { DEFAULT_SETTINGS, GPTPluginSettings } from "./types";

export const AppContext = React.createContext<App>(undefined);

export const SettingsContext =
  React.createContext<GPTPluginSettings>(DEFAULT_SETTINGS);
