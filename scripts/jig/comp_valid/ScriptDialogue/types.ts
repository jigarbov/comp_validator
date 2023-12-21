import { RawMessage } from "@minecraft/server";
import { FormCancelationReason, FormRejectReason, ModalFormData } from "@minecraft/server-ui";


type DialogueString = string | RawMessage;

interface DialogueElementButton {
  name: string;
  text: DialogueString;
  iconPath?: string;
  dialogue?: ScriptDialogue;
}

interface DialogueElementOption {
  name: string;
  option: DialogueString;
}

interface DialogueElementBase {
  type: unknown;
  name: string;
}

export interface DialogueElementDropdown extends DialogueElementBase {
  type: 'dropdown';
  label: DialogueString;
  options: Array<DialogueElementOption>;
  defaultValue?: string | number;
}

export interface DialogueElementSlider extends DialogueElementBase {
  type: 'slider';
  label: DialogueString;
  minimumValue: number;
  maximumValue: number;
  valueStep: number;
  defaultValue: number;
}

export interface DialogueElementTextField extends DialogueElementBase {
  type: 'text';
  label: DialogueString;
  placeholder: DialogueString;
  defaultValue?: string;
}

export interface DialogueElementToggle extends DialogueElementBase {
  type: 'toggle';
  label: DialogueString;
  defaultValue?: boolean;
}

export type DialogueElementInput = DialogueElementDropdown | DialogueElementSlider | DialogueElementTextField | DialogueElementToggle;

export interface ButtonDialogue {
  type: 'button_dialogue';
  title?: DialogueString;
  body?: DialogueString;
  buttons: Array<DialogueElementButton>;
}

export interface DualButtonDialogue {
  type: 'dual_button_dialogue';
  title?: DialogueString;
  body?: DialogueString;
  bottomButton: DialogueElementButton;
  topButton: DialogueElementButton;
}

export interface InputDialogue {
  type: 'input_dialogue';
  title?: DialogueString;
  inputs: Array<DialogueElementInput>;
}

export type ScriptDialogue = ButtonDialogue | DualButtonDialogue | InputDialogue;
export type ScriptDialogueResponse = ButtonDialogueResponse | DualButtonDialogueResponse | InputDialogueResponse;

interface PlayerBusyDialogueResponse {
  type: 'busy';
  reason: FormCancelationReason;
}

interface RejectDialogueResponse {
  type: 'rejected';
  reason: FormRejectReason;
}

interface UnknownDialogueResponse {
  type: 'unknown';
  exception: unknown;
}

export type CanceledDialogueResponse = PlayerBusyDialogueResponse | RejectDialogueResponse | UnknownDialogueResponse;

export interface ButtonDialogueResponse {
  type: ButtonDialogue['type'];
  selected: string;
  dialogueResponse?: DualButtonDialogueResponse | ButtonDialogueResponse | InputDialogueResponse | CanceledDialogueResponse;
}

export interface DualButtonDialogueResponse {
  type: DualButtonDialogue['type'];
  selected: string;
  dialogueResponse?: DualButtonDialogueResponse | ButtonDialogueResponse | InputDialogueResponse | CanceledDialogueResponse;
}


export interface DropdownInputResponse {
  type: DialogueElementDropdown['type'];
  value: string;
}

export interface SliderInputResponse {
  type: DialogueElementSlider['type'];
  value: number;
}

export interface TextFieldInputResponse {
  type: DialogueElementTextField['type'];
  value: string;
}

export interface ToggleInputResponse {
  type: DialogueElementToggle['type'];
  value: boolean;
}

export type DialogueElementInputResponse = DropdownInputResponse | SliderInputResponse | TextFieldInputResponse | ToggleInputResponse;

export interface InputDialogueResponse {
  type: InputDialogue['type'];
  responses: Record<string, DialogueElementInputResponse>;
}
