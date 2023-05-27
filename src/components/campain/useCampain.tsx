import { getValue, useLocalStorage } from "../../Login/UseToken";

export default function useCampain() {
  return useLocalStorage<string>("campain");
}

export function getDefaultCampainList() {
  return getValue<string>("campain");
}