import { useMemo, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, Provider, IdlAccounts } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { Tictactoe as TicTacToeIdl } from "../utils/idls/tictactoe";
import TicTacToeJson from "../utils/idls/tictactoe.json";
import "./TicTacToe.css";
import { useSnackbar } from "notistack";
import { Box, Button, Typography } from "@material-ui/core";

import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

class StubWallet {
  publicKey: PublicKey = undefined as unknown as PublicKey;
  async signTransaction(tx: Transaction): Promise<Transaction> {
    throw new Error("Not implemented");
  }
  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    throw new Error("Not implemented");
  }
}
const STUB_WALLET = new StubWallet();

const ESCROW_PROGRAM_ID = new PublicKey(
  "BJiKgwZCSuoN5YHaxPuzYDVabejWUyEh4dAvrTVrpsFd"
);

type GameState = IdlAccounts<TicTacToeIdl>["gameState"];

export function TicTacToe() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new Provider(connection, wallet || STUB_WALLET, {});
  const [created, setCreated] = useState<boolean>(false);
  const [gameState, setGameState] = useState<[anchor.web3.Keypair, Object]>([
    anchor.web3.Keypair.generate(),
    {},
  ]);
  const { enqueueSnackbar } = useSnackbar();

  async function create() {
    const kp = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        state: kp.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [kp],
    });

    const g = await program.account.gameState.fetch(kp.publicKey);
    setGameState([kp, g]);
  }

  async function play(r: number, c: number) {
    await program.rpc.play(r, c, {
      accounts: {
        state: gameState[0].publicKey,
      },
      signers: [],
    });

    const g = await program.account.gameState.fetch(gameState[0].publicKey);
    if (g.status == 2) {
      enqueueSnackbar("X Wins!");
    } else if (g.status == 3) {
      enqueueSnackbar("O Wins!");
    }
    setGameState([gameState[0], g]);
  }

  const program = useMemo(() => {
    return new Program<TicTacToeIdl>(
      //@ts-ignore
      TicTacToeJson as TicTacToeIdl,
      ESCROW_PROGRAM_ID,
      provider
    );
  }, [wallet]);

  if (!created) {
    return (
      <Box
        sx={{ justifyContent: "center", height: "100%", alignItems: "center" }}
      >
        <Box sx={{ width: "fit-content" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={async () => {
              try {
                await create();
                setCreated(true);
              } catch (e) {
                enqueueSnackbar(`${e}`, { variant: "error" });
              }
            }}
          >
            <Typography variant="h1">Create Game</Typography>
          </Button>
        </Box>
      </Box>
    );
  } else {
    var board = [];
    for (var i = 0; i < 3; i++) {
      var row = [];
      for (var j = 0; j < 3; j++) {
        // @ts-ignore
        const v = gameState[1].grid[i][j];
        row.push(<Square key={3 * i + j} i={i} j={j} val={v} play={play} />);
      }
      board.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }
    return (
      <div className="App">
        <div className="Board">{board}</div>
        <Box sx={{ width: "fit-content", alignItems: "center" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={async () => {
              try {
                await create();
                setCreated(true);
              } catch (e) {
                enqueueSnackbar(`${e}`, { variant: "error" });
              }
            }}
          >
            <Typography variant="h2">Reset Game</Typography>
          </Button>
        </Box>
      </div>
    );
  }
}

interface SquareProps {
  i: number;
  j: number;
  val: any;
  play: Function;
}

function Square(props: SquareProps) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <p
      key={3 * props.i + props.j}
      onClick={async () => {
        try {
          await props.play(props.i, props.j);
        } catch (e) {
          enqueueSnackbar("" + e, { variant: "error" });
        }
      }}
    >
      {props.val == 0 ? " " : props.val == 1 ? "x" : "o"}
    </p>
  );
}
