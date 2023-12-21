import { DualButtonDialogue } from "../ScriptDialogue/types";
import { debug, RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { RawMessage, world } from "@minecraft/server";
import { getScoreOr } from "../Scoreboard";
import { CUSTOM_OBJECTIVES, WORLD_INFO_OBJECTIVE } from "../WorldInfo";

export const viewStats = (board: string, stats: Array<string>): DualButtonDialogue => ({
  type: "dual_button_dialogue",
  title: RAW_TEXT(
    TRANSLATE("jig_ccomp:view-stats-board.title")
  ),
  body: RAW_TEXT(
    TEXT("§l"),TRANSLATE(board),TEXT("§r"),
    TEXT("\n"),
    ...buildStats(board, stats),
    TEXT("\n"),
    TRANSLATE(getCreditsKey(board))
  ),
  topButton: {
    name: "other-stats",
    text: TRANSLATE("jig_ccomp:view-stats-board.other-stats")
  },
  bottomButton: {
    name: "quit",
    text: TRANSLATE("jig_ccomp:quit"),
  }
})

const getCreditsKey = (board: string) => {
  if (board === WORLD_INFO_OBJECTIVE) {
    return '';
  }

  return board.replace(CUSTOM_OBJECTIVES, "credits.for.computers");
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
