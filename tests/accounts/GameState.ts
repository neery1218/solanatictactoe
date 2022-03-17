import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js"
import * as borsh from "@project-serum/borsh"
import * as types from "../types"
import { PROGRAM_ID } from "../programId"

export interface GameStateFields {
  turn: BN
  grid: Array<Array<types.SignKind | null>>
  status: types.StatusKind
}

export interface GameStateJSON {
  turn: string
  grid: Array<Array<types.SignJSON | null>>
  status: types.StatusJSON
}

export class GameState {
  readonly turn: BN
  readonly grid: Array<Array<types.SignKind | null>>
  readonly status: types.StatusKind

  static readonly discriminator = Buffer.from([
    144, 94, 208, 172, 248, 99, 134, 120,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("turn"),
    borsh.array(borsh.array(borsh.option(types.Sign.layout()), 3), 3, "grid"),
    types.Status.layout("status"),
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
      grid: dec.grid.map((item) =>
        item.map((item) => (item && types.Sign.fromDecoded(item)) || null)
      ),
      status: types.Status.fromDecoded(dec.status),
    })
  }

  toJSON(): GameStateJSON {
    return {
      turn: this.turn.toString(),
      grid: this.grid.map((item) =>
        item.map((item) => (item && item.toJSON()) || null)
      ),
      status: this.status.toJSON(),
    }
  }

  static fromJSON(obj: GameStateJSON): GameState {
    return new GameState({
      turn: new BN(obj.turn),
      grid: obj.grid.map((item) =>
        item.map((item) => (item && types.Sign.fromJSON(obj.item)) || null)
      ),
      status: types.Status.fromJSON(obj.status),
    })
  }
}
