import * as Status from "./Status"
import * as Sign from "./Sign"

export { Status }

export type StatusKind =
  | Status.Created
  | Status.InProgress
  | Status.XWins
  | Status.OWins
export type StatusJSON =
  | Status.CreatedJSON
  | Status.InProgressJSON
  | Status.XWinsJSON
  | Status.OWinsJSON

export { Sign }

export type SignKind = Sign.X | Sign.O
export type SignJSON = Sign.XJSON | Sign.OJSON
