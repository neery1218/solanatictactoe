import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import BN from "bn.js"
import * as borsh from "@project-serum/borsh"
import * as types from "../types"
import { PROGRAM_ID } from "../programId"

export interface CreateAccounts {
  state: PublicKey
  user: PublicKey
  systemProgram: PublicKey
}

export function create(accounts: CreateAccounts) {
  const keys = [
    { pubkey: accounts.state, isSigner: true, isWritable: true },
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
