import { InputDialogue } from "../ScriptDialogue/types";
import { TRANSLATE, RAW_TEXT, TEXT} from "../Utils";

export const viewSelectRadar = (): InputDialogue => ({
  type: "input_dialogue",
  title: TRANSLATE("jig_ccomp:select-radar.title"),
  inputs: [
    {
      type: "dropdown",
      name: "radar",
      label: RAW_TEXT(
		TEXT("\n"),TRANSLATE("jig_ccomp:select-radar.radar")
	  ),
      defaultValue: "monster",
      options: [
        {
          name: "monster",
          option: TRANSLATE("jig_ccomp:select-radar.radar.monster")
        },
        {
          name: "tamed",
          option: TRANSLATE("jig_ccomp:select-radar.radar.tamed")
        },
        {
          name: "villager",
          option: TRANSLATE("jig_ccomp:select-radar.radar.villager")
        },
        {
          name: "rideable",
          option: TRANSLATE("jig_ccomp:select-radar.radar.rideable")
        }
      ]
    }
  ]
})
