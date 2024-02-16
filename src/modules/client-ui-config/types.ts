export type ClientUiConfigCandidate = {
  name: string;
  type: string;
  isFolder: boolean;
  items: ClientUiConfigCandidate[];
};
