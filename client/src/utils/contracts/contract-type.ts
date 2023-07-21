import abi from "./PromiseToFriends.json";
export const CONTRACT_ADDRESS = "0x593A2c748Ba4493797De7cB17375335B9CC86a8F";
export const CONTRACT_ABI = abi.abi;
export const EVENT_SIGNATURE =
  "PromiseUpdate(address,address,PromiseStatus, uint256, uint, string, uint256)";

export enum PromiseStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export type PromiseEvent = {
  id: number;
  amount: string;
  message: string;
  status: PromiseStatus;
};

export type PromiseDetail = {
  id: number;
  to: string;
  from: string;
  amount: string;
  message: string;
  expireAt: Date;
  status: PromiseStatus;
  isSettled: boolean;
};
