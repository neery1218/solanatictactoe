import * as borsh from "@project-serum/borsh"
import BN from "bn.js"
import * as types from "."

export interface EmptyJSON {
  kind: "Empty"
}

export class Empty {
  readonly discriminator = 0
  readonly kind = "Empty"

  toJSON(): EmptyJSON {
    return {
      kind: "Empty",
    }
  }

  toEncodable() {
    return {
      Empty: {},
    }
  }
}

export interface XJSON {
  kind: "X"
}

export class X {
  readonly discriminator = 1
  readonly kind = "X"

  toJSON(): XJSON {
    return {
      kind: "X",
    }
  }

  toEncodable() {
    return {
      X: {},
    }
  }
}

export interface OJSON {
  kind: "O"
}

export class O {
  readonly discriminator = 2
  readonly kind = "O"

  toJSON(): OJSON {
    return {
      kind: "O",
    }
  }

  toEncodable() {
    return {
      O: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.MarkKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Empty" in obj) {
    return new Empty()
  }
  if ("X" in obj) {
    return new X()
  }
  if ("O" in obj) {
    return new O()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.MarkJSON): types.MarkKind {
  switch (obj.kind) {
    case "Empty": {
      return new Empty()
    }
    case "X": {
      return new X()
    }
    case "O": {
      return new O()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Empty"),
    borsh.struct([], "X"),
    borsh.struct([], "O"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
