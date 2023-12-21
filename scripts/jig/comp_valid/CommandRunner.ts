import { CommandResult, system } from "@minecraft/server";

export interface CommandRunner {
  runCommandAsync(commandString: string): Promise<CommandResult>;
  runCommand(commandString: string): CommandResult;
}

export interface CommandRunnerHandler {
  pendingCommands: Array<Command>;
  runId: number | undefined;
  runner: CommandRunner;
  batchCount: number;
}

export type Command = string | (() => Promise<void>);

export const createCommandRunner = (runner: CommandRunner, batchCount: number): CommandRunnerHandler => {
  if (batchCount > 128) {
    throw new Error('Running more commands than allowed at once');
  }

  return {
    pendingCommands: [],
    runId: undefined,
    batchCount,
    runner
  };
};

const runCommandLoop = (handler: CommandRunnerHandler) => {
  const count = Math.min(handler.batchCount, handler.pendingCommands.length);
  const toRun = handler.pendingCommands.splice(0, count);

  for (const command of toRun) {
    if (typeof command === 'string') {
      // Would this stall the tick?
      handler.runner.runCommand(command);
    } else {
      command();
    }
  }

  if (handler.pendingCommands.length > 0) {
    // See you on next tick!
    handler.runId = system.run(() => {
      runCommandLoop(handler);
    });
  } else {
    handler.runId = undefined;
  }
};

/**
 * Executes multiple commands in batch.
 * This ensures we don't process more commands that can be handled in a single tick.
 */
export const runCommands = (handler: CommandRunnerHandler, commands: Array<Command>, addCommandsToEndOfQueue = true): void => {
  if (addCommandsToEndOfQueue) {
    handler.pendingCommands.push(...commands);
  } else {
    handler.pendingCommands.unshift(...commands);
  }

  // Not running and there is something to process - start ticking!
  if (handler.pendingCommands.length > 0 && handler.runId === undefined) {
    handler.runId = system.run(() => {
      runCommandLoop(handler);
    });
  }
};
