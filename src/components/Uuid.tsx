import { v4 as getuuid } from 'uuid';

export default function addUUID<T extends UUID>(val: T) {
  if (val.key) {
    return val;
  }
  val.key = getuuid();
  return val;
};

export {getuuid};

export interface UUID {
  key?: string;
}