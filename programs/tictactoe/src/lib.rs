use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[error_code]
pub enum TicTacToeError {
    TileOutOfBounds,
    TileAlreadySet,
    GameAlreadyOver,
    NotPlayersTurn,
}

#[program]
pub mod tictactoe {
    use super::*;

    pub fn create(ctx: Context<CreateGame>) -> Result<()> {
        let game = &mut ctx.accounts.state;
        game.turn = 0;
        game.grid = [[None; 3]; 3];
        game.status = Status::Created;

        Ok(())
    }

    pub fn play(ctx: Context<Play>, r: u8, c: u8) -> Result<()> {
        msg!("Play!");
        let game = &mut ctx.accounts.state;
        if matches!(game.status, Status::XWins | Status::OWins) {
            return err!(TicTacToeError::GameAlreadyOver);
        }

        match game
            .grid
            .get(r as usize)
            .and_then(|row| row.get(c as usize))
        {
            None => err!(TicTacToeError::TileOutOfBounds),
            Some(&Some(_)) => err!(TicTacToeError::TileAlreadySet),
            Some(None) => {
                game.grid[r as usize][c as usize] = match game.turn % 2 {
                    0 => Some(Sign::X),
                    1 => Some(Sign::O),
                    _ => unreachable!(),
                };
                game.status = check_win(&game.grid, (r as usize, c as usize));
                game.turn += 1;
                Ok(())
            }
        }
    }
}

fn check_win(grid: &[[Option<Sign>; 3]; 3], (r, c): (usize, usize)) -> Status {
    let sign = grid[r][c];

    let win_status = match sign {
        Some(Sign::X) => Status::XWins,
        Some(Sign::O) => Status::OWins,
        None => Status::InProgress,
    };

    if (0..3).all(|i| grid[i][c] == sign) {
        msg!("winner 1!");
        return win_status;
    }

    if (0..3).all(|i| grid[r][i] == sign) {
        msg!("winner 2!");
        return win_status;
    }

    if (0..3).all(|i| grid[i][i] == sign) {
        msg!("winner 3!");
        return win_status;
    }

    if (0..2).all(|i| grid[2 - r][i] == sign) {
        msg!("winner 4!");
        return win_status;
    }

    msg!("continue");
    Status::InProgress
}

#[derive(Accounts)]
pub struct CreateGame<'info> {
    #[account(init, payer = user, space = 8 + std::mem::size_of::<GameState>())]
    pub state: Account<'info, GameState>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub state: Account<'info, GameState>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Status {
    Created,
    InProgress,
    XWins,
    OWins,
}

#[account]
pub struct GameState {
    pub turn: u64,
    pub grid: [[Option<Sign>; 3]; 3],
    pub status: Status,
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum Sign {
    X = 0,
    O = 1,
}
