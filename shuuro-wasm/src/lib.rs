mod utils;

use itertools::Itertools;
use js_sys::{Array, Map, Uint8Array};
use serde::{Deserialize, Serialize};
use shuuro::{self, piece_type::PieceTypeIter, Color, Move, Piece, PieceType, Position};
use shuuro::{init, square_bb, Square, SQUARE_BB};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub struct ShuuroShop {
    shuuro: shuuro::Shop,
}

#[wasm_bindgen]
impl ShuuroShop {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        ShuuroShop {
            shuuro: shuuro::Shop::default(),
        }
    }
    #[wasm_bindgen]
    pub fn buy(&mut self, s: char) -> Uint8Array {
        let piece = shuuro::Piece::from_sfen(s);
        match piece {
            Some(p) => {
                let shop_move = Move::Buy { piece: p };
                self.shuuro.play(shop_move);
                return self.js_shop_items(&p.color);
            }
            None => (),
        }
        return Uint8Array::new_with_length(7);
    }

    #[wasm_bindgen]
    pub fn confirm(&mut self, s: char) {
        let color = Color::from_char(s);
        match color {
            Some(c) => match c {
                Color::NoColor => (),
                _ => {
                    self.shuuro.confirm(c);
                }
            },
            None => (),
        }
    }

    #[wasm_bindgen]
    pub fn getCredit(&self, s: char) -> i32 {
        let color = Color::from_char(s);
        match color {
            Some(c) => match c {
                Color::NoColor => 800,
                _ => self.shuuro.credit(c),
            },

            None => 800,
        }
    }

    #[wasm_bindgen]
    pub fn isConfirmed(&self, s: char) -> bool {
        let color = Color::from_char(s);
        match color {
            Some(c) => match c {
                Color::NoColor => false,
                _ => self.shuuro.is_confirmed(c),
            },

            None => false,
        }
    }

    #[wasm_bindgen]
    pub fn shop_items(&self, s: char) -> Uint8Array {
        let color = Color::from_char(s);
        match color {
            Some(c) => match c {
                Color::NoColor => {
                    return Uint8Array::new_with_length(7);
                }
                _ => {
                    return self.js_shop_items(&c);
                }
            },
            None => (),
        }
        Uint8Array::new_with_length(7)
    }

    fn js_shop_items(&self, color: &Color) -> Uint8Array {
        let array = Uint8Array::new_with_length(7);
        let mut current_state: [u8; 7] = [0, 0, 0, 0, 0, 0, 0];
        let iterator = PieceTypeIter::new();
        for i in iterator {
            if i != PieceType::King || i != PieceType::Plinth {
                let piece = Piece {
                    piece_type: i,
                    color: *color,
                };
                let current = self.shuuro.get(piece);
                current_state[i.index()] = current;
                array.set_index(i.index() as u32, current);
            }
        }
        array
    }

    #[wasm_bindgen]
    pub fn get_piece(&self, s: char) -> u8 {
        let piece = shuuro::Piece::from_sfen(s);
        match piece {
            Some(p) => {
                return self.shuuro.get(p);
            }
            None => return 0,
        }
    }

    #[wasm_bindgen]
    pub fn set_hand(&mut self, hand: &str) {
        self.shuuro.set_hand(&hand);
    }
}

#[wasm_bindgen]
pub struct ShuuroPosition {
    shuuro: Position,
}

#[wasm_bindgen]
impl ShuuroPosition {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        init();
        ShuuroPosition {
            shuuro: Position::default(),
        }
    }

    #[wasm_bindgen]
    pub fn set_hand(&mut self, s: &str) {
        self.shuuro.set_hand(s);
    }

    #[wasm_bindgen]
    pub fn set_sfen(&mut self, s: &str) {
        self.shuuro.set_sfen(s);
    }
    /*
        #[wasm_bindgen]
        pub fn set_move_history(&mut self, history: Vec<(String, u16)>) {}
    */
    #[wasm_bindgen]
    pub fn place(&mut self, p: char, sq: String) -> bool {
        let past_length = self.shuuro.get_sfen_history().len();
        if let Some(piece) = Piece::from_sfen(p) {
            if let Some(square) = Square::from_sfen(&sq) {
                self.shuuro.place(piece, square);
            }
        }
        let current_length = self.shuuro.get_sfen_history().len();
        current_length > past_length
    }

    pub fn place_moves(&mut self, piece: char) -> Map {
        let list = Map::new();
        if let Some(p) = Piece::from_sfen(piece) {
            let bb = self.shuuro.empty_squares(p);
            let moves = Array::new();
            for i in bb {
                moves.push(&JsValue::from_str(i.to_string().as_str()));
            }
            let key = format!("{}@", piece.to_uppercase());
            let key = JsValue::from_str(key.as_str());
            let value = JsValue::from(moves);
            list.set(&key, &value);
        }
        list
    }

    pub fn side_to_move(&self) -> String {
        self.shuuro.side_to_move().to_string()
    }

    #[wasm_bindgen]
    pub fn play(&mut self, from: &str, to: &str) -> String {
        let res = self.shuuro.play(&from, &to);
        match res {
            Ok(i) => i.to_string(),
            Err(_) => String::from("illegal_move"),
        }
    }

    #[wasm_bindgen]
    pub fn legal_moves(&self, sq: &str) -> Array {
        let moves = Array::new();
        if let Some(square) = Square::from_sfen(&String::from(sq)) {
            let l_m = self.shuuro.legal_moves(&square);
            for i in l_m {
                let value = JsValue::from_str(&i.to_string()[..]);
                moves.push(&value);
            }
        }
        moves
    }

    #[wasm_bindgen]
    pub fn side_to_move(&self) -> String {
        self.shuuro.side_to_move().to_string()
    }
}

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub role: String,
    pub color: String,
}

#[wasm_bindgen]
pub fn test() -> Map {
    let mut list = Map::new();
    let example = Example {
        role: String::from("k-piece"),
        color: String::from("white"),
    };
    list.set(
        &JsValue::from_str("a1"),
        &JsValue::from_serde(&example).unwrap(),
    );
    list
}
