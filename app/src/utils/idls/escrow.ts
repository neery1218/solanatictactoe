export type Escrow = {
  "version": "0.0.0",
  "name": "escrow",
  "instructions": [
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerReceiveTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        },
        {
          "name": "takerAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "exchange",
      "accounts": [
        {
          "name": "taker",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "takerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "takerReceiveTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializerReceiveTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expectedDepositAmount",
          "type": "u64"
        },
        {
          "name": "expectedTakerAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "depositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "initializerReceiveTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "takerAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "UnexpectedEscrowState",
      "msg": "Unexpected escrow state"
    }
  ]
}