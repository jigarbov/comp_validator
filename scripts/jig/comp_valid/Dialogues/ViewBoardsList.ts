import { InputDialogue } from "../ScriptDialogue/types";
import { TRANSLATE,RAW_TEXT,TEXT } from "../Utils";
import { WORLD_INFO_OBJECTIVE } from "../WorldInfo";

export const viewBoardsList = (boards: Array<string>): InputDialogue => ({
  type: "input_dialogue",
  title: TRANSLATE("jig_ccomp:view-stat-list.title"),
  inputs: [
    {
      type: "dropdown",
      defaultValue: WORLD_INFO_OBJECTIVE,
      label: RAW_TEXT(
		TEXT("\n"),TRANSLATE("jig_ccomp:view-stat-list.board")
	  ),
      name: "board",
      options: boards.map(b => ({
        name: b,
        option: b
      }))
    }
  ]
})
