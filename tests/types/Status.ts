import * as borsh from "@project-serum/borsh"
import BN from "bn.js"
import * as types from "."

export interface CreatedJSON {
  kind: "Created"
}

export class Created {
  readonly discriminator = 0
  readonly kind = "Created"

  toJSON(): CreatedJSON {
    return {
      kind: "Created",
    }
  }

  toEncodable() {
    return {
      Created: {},
    }
  }
}

export interface InProgressJSON {
  kind: "InProgress"
}

export class InProgress {
  readonly discriminator = 1
  readonly kind = "InProgress"

  toJSON(): InProgressJSON {
    return {
      kind: "InProgress",
    }
  }

  toEncodable() {
    return {
      InProgress: {},
    }
  }
}

export interface XWinsJSON {
  kind: "XWins"
}

export class XWins {
  readonly discriminator = 2
  readonly kind = "XWins"

  toJSON(): XWinsJSON {
    return {
      kind: "XWins",
    }
  }

  toEncodable() {
    return {
      XWins: {},
    }
  }
}

export interface OWinsJSON {
  kind: "OWins"
}

export class OWins {
  readonly discriminator = 3
  readonly kind = "OWins"

  toJSON(): OWinsJSON {
    return {
      kind: "OWins",
    }
  }

  toEncodable() {
    return {
      OWins: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Created" in obj) {
    return new Created()
  }
  if ("InProgress" in obj) {
    return new InProgress()
  }
  if ("XWins" in obj) {
    return new XWins()
  }
  if ("OWins" in obj) {
    return new OWins()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.StatusJSON): types.StatusKind {
  switch (obj.kind) {
    case "Created": {
      return new Created()
    }
    case "InProgress": {
      return new InProgress()
    }
    case "XWins": {
      return new XWins()
    }
    case "OWins": {
      return new OWins()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Created"),
    borsh.struct([], "InProgress"),
    borsh.struct([], "XWins"),
    borsh.struct([], "OWins"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
