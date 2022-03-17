import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import BN from "bn.js"
import * as borsh from "@project-serum/borsh"
import * as types from "../types"
import { PROGRAM_ID } from "../programId"

export interface PlayArgs {
  r: number
  c: number
}

export interface PlayAccounts {
  state: PublicKey
}

export const layout = borsh.struct([borsh.u8("r"), borsh.u8("c")])

export function play(args: PlayArgs, accounts: PlayAccounts) {
  const keys = [{ pubkey: accounts.state, isSigner: false, isWritable: true }]
  const identifier = Buffer.from([213, 157, 193, 142, 228, 56, 248, 150])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      r: args.r,
      c: args.c,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
