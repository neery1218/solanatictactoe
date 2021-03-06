export type Tictactoe = {
  "version": "0.1.0",
  "name": "tictactoe",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "r",
          "type": "u8"
        },
        {
          "name": "c",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "grid",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "status",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Created"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "XWins"
          },
          {
            "name": "OWins"
          }
        ]
      }
    },
    {
      "name": "Mark",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "X"
          },
          {
            "name": "O"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TileOutOfBounds"
    },
    {
      "code": 6001,
      "name": "TileAlreadySet"
    },
    {
      "code": 6002,
      "name": "GameAlreadyOver"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn"
    },
    {
      "code": 6004,
      "name": "BadStatus"
    }
  ]
};

export const IDL: Tictactoe = {
  "version": "0.1.0",
  "name": "tictactoe",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "r",
          "type": "u8"
        },
        {
          "name": "c",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "grid",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "status",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Created"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "XWins"
          },
          {
            "name": "OWins"
          }
        ]
      }
    },
    {
      "name": "Mark",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "X"
          },
          {
            "name": "O"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TileOutOfBounds"
    },
    {
      "code": 6001,
      "name": "TileAlreadySet"
    },
    {
      "code": 6002,
      "name": "GameAlreadyOver"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn"
    },
    {
      "code": 6004,
      "name": "BadStatus"
    }
  ]
};
