import { Vector3, RawMessage, Dimension, world, ItemStack, BlockPermutation } from "@minecraft/server";

// export const ensureBlockType = (blockTypeString: string): BlockType => {
//   const blockType = BlockTypes.get(blockTypeString);
//   if (!blockType) {
//     throw new Error(`Block type of '${blockTypeString}' wasn't found.`);
//   }
//
//   return blockType;
// }

export const makeVector3 = (x: number, y: number, z: number): Vector3 => ({
  x,
  y,
  z
});

// From https://stackoverflow.com/a/39495173
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export const clampToRange = <MIN extends number, MAX extends  number>
  (value: number, min: MIN, max: MAX): IntRange<MIN, MAX> => {
  if (value < min) {
    return min as IntRange<MIN, MAX>;
  } else if (value > max) {
    return max as IntRange<MIN, MAX>;
  }

  return value as IntRange<MIN, MAX>;
}

export const TRANSLATE = (key: string, ...params: Array<string>): RawMessage => ({
  translate: key,
  with: params
});

export const RAW_TEXT = (...rawText: Array<RawMessage>): RawMessage => ({
  rawtext: rawText
});

export const TEXT = (value: number | string): RawMessage => ({
  text: value.toString()
});

export const ITEM = (item: ItemStack): RawMessage => {
  let key = item.typeId;

  let addName = false;

  if (item.hasComponent("display_name")) {
    addName = true;
  }

  // Removes minecraft prefix if found.
  if (key.startsWith("minecraft:")) {
    addName = true;
    key = key.substring("minecraft:".length);
  }

  // Moves spawn_egg postfix if found
  if (key.endsWith("_spawn_egg")) {
    addName = true;
    key = `spawn_egg.entity.${key.replace("_spawn_egg", "")}`;
  }

  let isBlock: boolean;
  try {
    BlockPermutation.resolve(item.typeId);
    isBlock = true;
    addName = true;
  } catch (e) {
    isBlock = false;
  }

  if (addName) {
    key = `${key}.name`;
  }

  if (isBlock) {
    key = `tile.${key}`;
  } else {
    key = `item.${key}`;
  }

  return TRANSLATE(key);
};

export const ENTITY = (entity: string): RawMessage => {
  let key = entity;
  if (key.startsWith("minecraft:")) {
    key = `entity.${key.substring("minecraft:".length)}.name`;
  } else {
    key = `entity.${key}.name`;
  }

  return TRANSLATE(key);
}

interface FillOptions {
  replace?: string;
}

// export const runFillBlock = (dimension: Dimension, from: Vector3, to: Vector3, block: string | BlockType, options?: FillOptions) => {
//   const optionsCommand = options?.replace ? `replace ${options.replace}` : '';
//
//   dimension.runCommand(`fill  ${vector3ToString(from)} ${vector3ToString(to)} ${blockTypeToString(block)} ${optionsCommand}`);
// }

export const vector3ToString = (vector3: Vector3) => `${vector3.x} ${vector3.y} ${vector3.z}`;
// export const blockTypeToString = (blockType: string | BlockType) => typeof blockType === 'string' ? blockType : blockType.id;

export const debug = (what: string | (() => string)) => {
  const players = world.getPlayers({
    tags: ["debug"]
  });

  if (players.length > 0) {
    const text = typeof what === 'string' ? what : what();
    for (const player of players) {
      void player.dimension.runCommandAsync(`w ${player.name} debug: ${text}`);
    }
  }
}
