import { DualButtonDialogue } from "../ScriptDialogue/types";
import { debug, RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { RawMessage, world } from "@minecraft/server";
import { getScoreOr } from "../Scoreboard";
import { CUSTOM_OBJECTIVES } from "../WorldInfo";

export const viewStats = (board: string, stats: Array<string>): DualButtonDialogue => ({
  type: "dual_button_dialogue",
  title: RAW_TEXT(
    TRANSLATE("Analysis Complete")
  ),
  body: RAW_TEXT(
    TEXT("§l"),TRANSLATE(board),TEXT("§r"),
    TEXT("\n\n"),
	...isThereNone(board),
    ...buildStats(board, stats),
    TEXT("\n"),
    TRANSLATE(getCreditsKey(board),"\n")
  ),
  topButton: {
    name: "other-stats",
    text: TRANSLATE("Main Menu")
  },
  bottomButton: {
    name: "quit",
    text: TRANSLATE("Quit"),
  }
})

const getCreditsKey = (board: string) => {

  return board.replace(CUSTOM_OBJECTIVES, "credits.for.computers");
}

const isThereNone = (board: string) => {
	const objective = world.scoreboard.getObjective(board);
	if (!objective) {
		debug(`Couldn't find objective ${board}`);
		return [];
	  }
	let test = objective.getParticipants()
    if (test.length == 0) {
        return [
			TEXT("§7*Beep boop*§r §eThere are no stats to report from this addon yet. Engage with it more and check back later.§r"),TEXT("\n")];
    }
      return [];
  }
const buildStats = (board: string, stats: Array<string>): Array<RawMessage> => {
  const objective = world.scoreboard.getObjective(board);
  if (!objective) {
    debug(`Couldn't find objective ${board}`);
    return [];
  }

  return stats.map(stat => RAW_TEXT(
    TRANSLATE(stat),
    TEXT(":\n"),
    TEXT(getScoreOr(objective, stat, 0)),
    TEXT("\n"),
  ));
}
