import { world, ScoreboardObjective } from "@minecraft/server";

//set your stats
export type StatIDs = "example_stat_a" | "example_stat_b";

export default class ComputersCompat {
	//set your namespace
    private static addonNameSpace = "jig_example";
	//leave the rest!
	private static computersScoreboardID = "jig_computer.addon_stats";
    private static addonStatScoreboardID = `${this.addonNameSpace}:${this.computersScoreboardID}`;
	private static addonStatObjective: ScoreboardObjective;

    /**
     * Initializes the scoreboard's required for Jigs Computers Add-On to have stats for this add-on
     * @static
     */
    static init() {
        if (!world.scoreboard.getObjective(this.addonStatScoreboardID)) {
            world.scoreboard.addObjective(this.addonStatScoreboardID, "dummy");
        }
        this.addonStatObjective = world.scoreboard.getObjective(this.addonStatScoreboardID)!;
    }

    /**
     * Adds to a statistic tracked by Jigs Computers Add-On.
     *
     * @param statID - The identifier of the statistic to add, defined in {@link StatIDs}.
     * @param amount - The amount to add to the statistic.
     */
    static addStat(statID: StatIDs, amount: number) {
        this.addonStatObjective?.addScore(`${this.addonNameSpace}:${statID}`, amount);
    }
}

