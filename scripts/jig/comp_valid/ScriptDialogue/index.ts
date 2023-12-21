import {
  ActionFormData,
  FormRejectReason,
  MessageFormData,
  ModalFormData,
  ModalFormResponse,
} from "@minecraft/server-ui";
import {
  ButtonDialogue, ButtonDialogueResponse,
  CanceledDialogueResponse,
  DialogueElementDropdown,
  DialogueElementInput, DialogueElementInputResponse, DualButtonDialogue, DualButtonDialogueResponse,
  InputDialogue,
  InputDialogueResponse, ScriptDialogue, ScriptDialogueResponse,
} from "./types";
import { Player } from "@minecraft/server";
import { debug } from "../Utils";

export const openScriptDialogue = async (dialogue: ScriptDialogue, player: Player): Promise<ScriptDialogueResponse | CanceledDialogueResponse> => {
  switch (dialogue.type) {
    case "button_dialogue":
      return openButtonDialogue(dialogue, player);
    case "dual_button_dialogue":
      return openDualButtonDialogue(dialogue, player);
    case "input_dialogue":
      return openInputDialogue(dialogue, player);
  }
}

export const openDualButtonDialogue = async (dualButtonDialogue: DualButtonDialogue, player: Player): Promise<DualButtonDialogueResponse | CanceledDialogueResponse> => {
  const formData = new MessageFormData();

  if (dualButtonDialogue.title) {
    formData.title(dualButtonDialogue.title);
  }

  if (dualButtonDialogue.body) {
    formData.body(dualButtonDialogue.body);
  }

  if (dualButtonDialogue.bottomButton) {
    formData.button1(dualButtonDialogue.bottomButton.text);
  }

  if (dualButtonDialogue.topButton) {
    formData.button2(dualButtonDialogue.topButton.text);
  }

  try {
    const response = await formData.show(player);
    if (response.canceled) {
      return {
        type: "busy",
        reason: response.cancelationReason!
      };
    }

    const selectedButton = response.selection === 0 ? dualButtonDialogue.bottomButton : dualButtonDialogue.topButton!;
    let nestedDialogue: ScriptDialogueResponse | CanceledDialogueResponse | undefined;
    if (selectedButton.dialogue) {
      nestedDialogue = await openScriptDialogue(selectedButton.dialogue, player);
    }

    return {
      type: 'dual_button_dialogue',
      selected: selectedButton.name,
      dialogueResponse: nestedDialogue
    };
  } catch (e) {
    if (e && typeof e === 'object' && 'reason' in e) {
      const exception = e as any;
      return {
        type: "rejected",
        reason: exception.reason as FormRejectReason
      }
    } else {
      return {
        type: 'unknown',
        exception: e
      }
    }
  }
};

export const openButtonDialogue = async (buttonDialogue: ButtonDialogue, player: Player): Promise<ButtonDialogueResponse | CanceledDialogueResponse> => {
  const formData = new ActionFormData();

  if (buttonDialogue.title) {
    formData.title(buttonDialogue.title);
  }

  if (buttonDialogue.body) {
    formData.body(buttonDialogue.body);
  }

  buttonDialogue.buttons.forEach(button => {
    formData.button(button.text);
  });

  try {
    const response = await formData.show(player);
    if (response.canceled) {
      return {
        type: "busy",
        reason: response.cancelationReason!
      };
    }

    const selectedButton = buttonDialogue.buttons[response.selection as number];
    let nestedDialogue: ScriptDialogueResponse | CanceledDialogueResponse | undefined;
    if (selectedButton.dialogue) {
      nestedDialogue = await openScriptDialogue(selectedButton.dialogue, player);
    }

    return {
      type: 'button_dialogue',
      selected: selectedButton.name,
      dialogueResponse: nestedDialogue
    };
  } catch (e) {
    if (e && typeof e === 'object' && 'reason' in e) {
      const exception = e as any;
      return {
        type: "rejected",
        reason: exception.reason as FormRejectReason
      }
    } else {
      return {
        type: 'unknown',
        exception: e
      }
    }
  }
}

export const openInputDialogue = async (inputDialogue: InputDialogue, player: Player): Promise<InputDialogueResponse | CanceledDialogueResponse> => {
  const modalFormData = new ModalFormData();

  if (inputDialogue.title) {
    modalFormData.title(inputDialogue.title);
  }

  for (const input of inputDialogue.inputs) {
    addInput(modalFormData, input);
  }

  try {
    const response = await modalFormData.show(player);
    if (response.canceled) {
      return {
        type: "busy",
        reason: response.cancelationReason!
      };
    }

    return {
      type: 'input_dialogue',
      responses: getResponses(response, inputDialogue)
    }

  } catch (e) {
    if (e && typeof e === 'object' && 'reason' in e) {
      const exception = e as any;
      return {
        type: "rejected",
        reason: exception.reason as FormRejectReason
      }
    } else {
      return {
        type: 'unknown',
        exception: e
      }
    }
  }
}

const getResponses = (response: ModalFormResponse, inputDialogue: InputDialogue): Record<string, DialogueElementInputResponse> => {
  return Object.fromEntries(
    response.formValues!.map((value, index) => fetchInputDialogueResponse(value, inputDialogue.inputs[index]))
  );
}

const addInput = (modalFormData: ModalFormData, input: DialogueElementInput) => {
  switch (input.type) {
    case "dropdown":
      modalFormData.dropdown(
        input.label,
        input.options.map(o => o.option),
        typeof input.defaultValue === 'string' ? input.options.findIndex(o => o.name === input.defaultValue) : input.defaultValue
      );
      break;
    case "slider":
      modalFormData.slider(
        input.label,
        input.minimumValue,
        input.maximumValue,
        input.valueStep,
        input.defaultValue
      );
      break;
    case "text":
      modalFormData.textField(
        input.label,
        input.placeholder,
        input.defaultValue
      );
      break;
    case "toggle":
      modalFormData.toggle(input.label, input.defaultValue);
      break;
  }
}

const fetchInputDialogueResponse = (value: string | number | boolean, input: DialogueElementInput): [string, DialogueElementInputResponse] => {
  switch (input.type) {
    case "dropdown":
      return [input.name, {
        type: input.type,
        value: getDropdownValue(value, input)
      }];
    case "slider":
      return [input.name, {
        type: input.type,
        value: value as number
      }];
    case "text":
      return [input.name, {
        type: input.type,
        value: value as string
      }];
    case "toggle":
      return [input.name, {
        type: input.type,
        value: value as boolean
      }];
  }
}

const getDropdownValue = (value: string | number | boolean, input: DialogueElementDropdown): string => {
  if (value === undefined) {
    const defaultValue = input.defaultValue ?? 0;
    if (typeof defaultValue === 'string') {
      const option = input.options.find(o => o.name === defaultValue);
      if (option) {
        return option.name;
      }

      debug(`[ERROR] Default option defined in Dropdown is not found, using 0. ${input.defaultValue}`);
      return input.options[0].name;
    } else {
      if (defaultValue >= input.options.length) {
        debug(`[ERROR] Default option defined in Dropdown: ${input.name} is not found, using 0. ${input.defaultValue}`);
        return input.options[0].name;
      }

      return input.options[defaultValue].name;
    }
  }

  return input.options[value as number].name;
}
