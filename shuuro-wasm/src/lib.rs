mod utils;

use js_sys::{Array, Uint8Array};
use shuuro::{self, piece_type::PieceTypeIter, Color, Move, Piece, PieceType};
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

    #[wasm_bindgen]
    pub fn test(&self) -> Array {
        let lista = Array::new();
        lista.push(&JsValue::from_str(&"color"));
        lista.push(&JsValue::from_str(&"piece"));
        lista.push(&JsValue::bigint_from_str(&"11"));
        lista
    }
}
