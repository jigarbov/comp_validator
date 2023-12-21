import { ScoreboardObjective, world } from "@minecraft/server";

export const getScoreOr = (scoreboardObjectiveOrName: string | ScoreboardObjective | undefined, score: string, defaultValue: number): number => {
  try {
    const value = getScoreInternal(scoreboardObjectiveOrName, score);
    if (value === undefined) {
      return defaultValue;
    }

    return value;
  } catch (e) {
    return defaultValue;
  }
}

export const getScore = (scoreboardObjectiveOrName: string | ScoreboardObjective | undefined, score: string): number | undefined => {
  try {
    return getScoreInternal(scoreboardObjectiveOrName, score);
  } catch (e) {
    return undefined;
  }
}


export const getScoreInternal = (scoreboardObjectiveOrName: string | ScoreboardObjective | undefined, score: string) => {
  const scoreboardObjective = typeof scoreboardObjectiveOrName === 'string' ? world.scoreboard.getObjective(scoreboardObjectiveOrName) : scoreboardObjectiveOrName;

  if (!scoreboardObjective) {
    return undefined;
  }

  return scoreboardObjective.getScore(score);
};
