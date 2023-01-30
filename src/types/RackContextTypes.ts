import { InputNode, OutputNode, RackDestinationNode, RackNode } from './RackTypes';

export enum Actions {
  StartPatch,
  Connect,
  Disconnect,
  AddModule,
  RemoveModule,
  UpdateParam,
  AddOutput,
  AddInput,
  RemoveInput,
  RemoveOutput,
  Init,
}

export enum IO {
  Input = "Input",
  Output = "Output",
}

export type TPatch = {
  patchId: string,
  input: InputNode,
  output: OutputNode,
};

export interface IPatch {
  // node id
  [key: string] : { inputs: { [key: string] : InputNode }, outputs: { [key: string]: OutputNode } };
}

export type RackState = {
  context?: AudioContext,
  destination?: RackDestinationNode,
  // current input waiting for output to complete patch
  input: string,
  // current output waiting for input to complete patch
  output: string,
  // when both input and out put are present
  // a new patch will be created and input/output will be
  // cleared
  patches: IPatch,
  modules: RackNode[],
};

export type RackAction = {
  actionType: Actions,
  message?: any,
}
