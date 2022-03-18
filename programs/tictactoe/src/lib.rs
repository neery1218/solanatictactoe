use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

declare_id!("BJiKgwZCSuoN5YHaxPuzYDVabejWUyEh4dAvrTVrpsFd");

#[error_code]
pub enum TicTacToeError {
    TileOutOfBounds,
    TileAlreadySet,
    GameAlreadyOver,
    NotPlayersTurn,
    BadStatus,
}

#[program]
pub mod tictactoe {
    use super::*;

    pub fn create(ctx: Context<CreateGame>) -> Result<()> {
        let game = &mut ctx.accounts.state;
        game.turn = 0;
        game.grid = [[Mark::Empty as u8; 3]; 3];
        game.status = Status::Created as u8;

        Ok(())
    }

    pub fn play(ctx: Context<Play>, r: u8, c: u8) -> Result<()> {
        msg!("Play! ({},{})", r, c);
        msg!("size: {}", std::mem::size_of::<GameState>());
        let game = &mut ctx.accounts.state;
        msg!("grid before: {:?}", game.grid);

        require!(
            Status::from_u8(game.status) != None,
            TicTacToeError::BadStatus
        );

        if game.status == Status::XWins as u8 || game.status == Status::OWins as u8 {
            return err!(TicTacToeError::GameAlreadyOver);
        }
        game.status = Status::InProgress as u8;

        match game
            .grid
            .get(r as usize)
            .and_then(|row| row.get(c as usize))
        {
            None => err!(TicTacToeError::TileOutOfBounds),
            Some(&x) => match Mark::from_u8(x) {
                None => err!(TicTacToeError::BadStatus),
                Some(Mark::X) => err!(TicTacToeError::TileAlreadySet),
                Some(Mark::O) => err!(TicTacToeError::TileAlreadySet),
                Some(Mark::Empty) => {
                    game.grid[r as usize][c as usize] = match game.turn % 2 {
                        0 => Mark::X as u8,
                        1 => Mark::O as u8,
                        _ => unreachable!(),
                    };
                    game.status = check_win(&game.grid, (r as usize, c as usize)) as u8;
                    msg!("Status: {}", game.status);
                    game.turn += 1;
                    Ok(())
                }
            },
        }
    }
}

fn check_win(grid: &[[u8; 3]; 3], (r, c): (usize, usize)) -> Status {
    let sign = grid[r][c];

    let win_status = match Mark::from_u8(sign) {
        Some(Mark::X) => Status::XWins,
        Some(Mark::O) => Status::OWins,
        Some(Mark::Empty) => Status::InProgress,
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

    if (0..3).all(|i| grid[2 - i][i] == sign) {
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

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Clone, Copy, PartialEq, Eq,
)]
pub enum Status {
    Created = 0,
    InProgress = 1,
    XWins = 2,
    OWins = 3,
}

#[account]
pub struct GameState {
    pub turn: u8,
    pub grid: [[u8; 3]; 3],
    pub status: u8,
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum Mark {
    Empty = 0,
    X = 1,
    O = 2,
}
