import { InputDialogue } from "../ScriptDialogue/types";
import { TRANSLATE } from "../Utils";

export const setPcIdDialogue = (oldName: string) : InputDialogue => {
  return {
    type: "input_dialogue",
    title: TRANSLATE("jig_ccomp:pc-id-set.title"),
    inputs: [
      {
        type: "text",
        name: "name",
		label: TRANSLATE("jig_ccomp:pc-id-set.name.label"),
		placeholder: TRANSLATE("jig_ccomp:pc-id-set.name.placeholder"),
        defaultValue: oldName
      }
    ]
  };
};
