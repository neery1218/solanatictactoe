import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Tictactoe } from "../target/types/tictactoe";
const { SystemProgram } = anchor.web3;
import { GameState } from "./accounts/GameState";
import { Sign, SignKind } from "./types/index";
import { Connection } from "@solana/web3.js";

describe("tictactoe", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const connection = new Connection("http://localhost:8899");
  const program = anchor.workspace.Tictactoe as Program<Tictactoe>;

  async function play(r: number, c: number, gs: anchor.web3.Keypair) {
    await program.rpc.play(r, c, {
      accounts: {
        state: gs.publicKey,
      },
      signers: [],
    });
  }

  it("Full Game", async () => {
    // game state account
    const gs = anchor.web3.Keypair.generate();

    const tx = await program.rpc.create({
      accounts: {
        state: gs.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [gs],
    });

    await play(0,0, gs);

    // bounds check
    try {
      await play(4,4, gs);
      assert(false);
    }
    catch (err) {
       expect(err.toString()).to.equal("TileOutOfBounds");
    }

    // tile already set
    try {
      await play(0,0, gs);
      assert(false);
    }
    catch (err) {
       expect(err.toString()).to.equal("TileAlreadySet");
    }

    await play(0,1, gs);
    await play(1,1, gs);
    await play(0,2, gs);
    await play(2,2, gs);

    const g = await GameState.fetch(provider.connection, gs.publicKey);
    console.log(g);
    expect(g.status.kind).to.equal("XWins");

    try {
      await play(0,0, gs);
      assert(false);
    }
    catch (err) {
       expect(err.toString()).to.equal("GameAlreadyOver");
    }
  });
});
