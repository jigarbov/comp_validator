import { InputDialogue } from "../ScriptDialogue/types";
import { TRANSLATE,RAW_TEXT,TEXT } from "../Utils";

export const viewBoardsList = (boards: Array<string>): InputDialogue => ({
  type: "input_dialogue",
  title: TRANSLATE("Addon Stats"),
  inputs: [
    {
      type: "dropdown",
      label: RAW_TEXT(
		TEXT("\n"),TRANSLATE("Your addon will be listed here if it was correctly namespaced with studioname_packname:jig_computer.addon_stats If you are seeing raw text, check your lang file.")
	  ),
      name: "board",
      options: boards.map(b => ({
        name: b,
        option: b
      }))
    }
  ]
})
