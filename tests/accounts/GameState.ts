import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js"
import * as borsh from "@project-serum/borsh"
import * as types from "../types"
import { PROGRAM_ID } from "../programId"

export interface GameStateFields {
  turn: number
  grid: Array<Array<number>>
  status: number
}

export interface GameStateJSON {
  turn: number
  grid: Array<Array<number>>
  status: number
}

export class GameState {
  readonly turn: number
  readonly grid: Array<Array<number>>
  readonly status: number

  static readonly discriminator = Buffer.from([
    144, 94, 208, 172, 248, 99, 134, 120,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("turn"),
    borsh.array(borsh.array(borsh.u8(), 3), 3, "grid"),
    borsh.u8("status"),
  ])

  constructor(fields: GameStateFields) {
    this.turn = fields.turn
    this.grid = fields.grid
    this.status = fields.status
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<GameState | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static decode(data: Buffer): GameState {
    if (!data.slice(0, 8).equals(GameState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = GameState.layout.decode(data.slice(8))

    return new GameState({
      turn: dec.turn,
      grid: dec.grid,
      status: dec.status,
    })
  }

  toJSON(): GameStateJSON {
    return {
      turn: this.turn,
      grid: this.grid,
      status: this.status,
    }
  }

  static fromJSON(obj: GameStateJSON): GameState {
    return new GameState({
      turn: obj.turn,
      grid: obj.grid,
      status: obj.status,
    })
  }
}
