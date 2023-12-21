import { DualButtonDialogue } from "../ScriptDialogue/types";
import { debug, ENTITY, RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { Entity, RawMessage, Vector3 } from "@minecraft/server";

export interface RadarEntry {
  id: string;
  nametag: string | undefined;
  health: number;
  location: Vector3;
}

export const viewRadar = (radar: string, entries: Array<RadarEntry>): DualButtonDialogue => ({
  type: "dual_button_dialogue",
  title: RAW_TEXT(
    TRANSLATE("jig_ccomp:view-radar.title")
  ),
  body: RAW_TEXT(
    TEXT("§l"),TRANSLATE(`jig_ccomp:view-radar.${radar}`),TEXT("§r"),
    TEXT("\n"),
    ...buildEntries(entries),
    TEXT("\n"),
  ),
  topButton: {
    name: "other-radar",
    text: TRANSLATE("jig_ccomp:view-radar.other-radar")
  },
  bottomButton: {
    name: "quit",
    text: TRANSLATE("jig_ccomp:quit"),
  }
})

const round = (value: number) => {
  return Math.round(value * 100) / 100;
}
const moreround = (value: number) => {
  return Math.ceil(value);
}

const buildEntries = (entries: Array<RadarEntry>): RawMessage[] => {
  if (entries.length === 0) {
    return [
      TRANSLATE("jig_ccomp:view-radar.not-found")
    ];
  }

  return entries.map(buildEntry);
}

const buildEntry = (entry: RadarEntry): RawMessage => {
  const messages: Array<RawMessage> = [];
  let asd = Entity
  messages.push(ENTITY(entry.id));
  if (entry.nametag) {
	messages.push(TEXT(" "));
	  messages.push(TRANSLATE("jig_ccomp:view-radar.entity.name"));
    messages.push(TEXT(" "+entry.nametag));
  }
  
  messages.push(TEXT(` \uE10C ${moreround(entry.health)}`));
  messages.push(TEXT("\n"));
  messages.push(TEXT(`x: ${round(entry.location.x)}, y: ${round(entry.location.y)}, z: ${round(entry.location.z)}`));
  messages.push(TEXT("\n\n"));

  return RAW_TEXT(...messages);
}
