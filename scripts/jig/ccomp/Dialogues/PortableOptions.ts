import { InputDialogue } from "../ScriptDialogue/types";
import { RAW_TEXT, TEXT, TRANSLATE } from "../Utils";

interface ViewPortableOptionsParams {
  coordinates: boolean,
  biome: boolean,
  lightlevel: boolean
}

export const viewPortableOptions: (options: ViewPortableOptionsParams) => InputDialogue =
  ({ coordinates, biome, lightlevel}) => ({
  type: "input_dialogue",
  title: TRANSLATE("jig_ccomp:portable.options"),
  inputs: [
    {
      type: "toggle",
	  name: "coordinates name",
      value: coordinates,
      label: RAW_TEXT(TEXT("Toggle1"))
    },
    {
      type: "toggle",
	  name: "biome name",
      value: biome,
      label: RAW_TEXT(TEXT("Toggle2"))
    },
    {
      type: "toggle",
	  name: "light level name",
      value: lightlevel,
      label: RAW_TEXT(TEXT("Toggle3"))
    }
  ]
});