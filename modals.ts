import GPTPlugin from "main";
import { Modal, Editor, App, TextComponent } from "obsidian";

export class EditModal extends Modal {
  editInstruction: string;
  plugin: GPTPlugin;
  editor: Editor;

  constructor(app: App, plugin: GPTPlugin, editor: Editor) {
    super(app);
    this.plugin = plugin;
    this.editor = editor;
  }

  onOpen() {
    let { contentEl } = this;

    contentEl.createEl("h2", { text: "Enter Edit Instruction:" });

    const inputs = contentEl.createDiv("inputs");
    const editInput = new TextComponent(inputs).onChange((editInstruction) => {
      this.editInstruction = editInstruction;
    });
    editInput.inputEl.focus();
    editInput.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.close();
      }
    });

    const controls = contentEl.createDiv("controls");
    const searchButton = controls.createEl("button", {
      text: "Edit",
      cls: "mod-cta",
      attr: {
        autofocus: true,
      },
    });
    searchButton.addEventListener("click", this.close.bind(this));
    const cancelButton = controls.createEl("button", { text: "Cancel" });
    cancelButton.addEventListener("click", this.close.bind(this));
  }

  async onClose() {
    let { contentEl } = this;

    contentEl.empty();
    if (this.editInstruction) {
      await this.plugin.getEditResponseHandler(
        this.editor,
        this.editInstruction
      );
    }
  }
}
