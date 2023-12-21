import { Container, ItemStack } from "@minecraft/server";

export const getEmptySlot = (container: Container): number | undefined => {
  for (let i = 0; i < container.size; ++i) {
    if (container.getItem(i) === undefined) {
      return i;
    }
  }

  return undefined;
}

export const getSlotByCondition = (container: Container, condition: (item: ItemStack) => boolean): number | undefined => {
  for (let i = 0; i < container.size; ++i) {
    const item = container.getItem(i);
    if (item && condition(item)) {
      return i;
    }
  }

  return undefined;
}
