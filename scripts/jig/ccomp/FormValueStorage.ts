// ModalForms returns the results of a menu / form in the order they were added
// We need to keep track of what was added and in what order to be able to
// extract the information the user wrote / selected in there.
import { ModalFormResponse } from "@minecraft/server-ui";

export class FormValueStorage<T> {
  private index = 0;
  private readonly values: OptionalRecord<keyof T, number> = {};
  private modalFormResponse?: ModalFormResponse;

  setModalFormResponse(modalFormResponse: ModalFormResponse) {
    this.modalFormResponse = modalFormResponse;
  }

  addValue(attribute: keyof T) {
    this.values[attribute] = this.index;
    this.index++;
  }

  getValue<V>(attribute: keyof T, defaultValue: V): V {
    const index = this.values[attribute] as number;
    if (this.modalFormResponse?.formValues === undefined || index === undefined || index === -1) {
      return defaultValue;
    }

    return this.modalFormResponse.formValues[index] as unknown as V;
  }

}

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
