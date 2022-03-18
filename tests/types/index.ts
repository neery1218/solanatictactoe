import * as Status from "./Status"
import * as Mark from "./Mark"

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

export { Mark }

export type MarkKind = Mark.Empty | Mark.X | Mark.O
export type MarkJSON = Mark.EmptyJSON | Mark.XJSON | Mark.OJSON
