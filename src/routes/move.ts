import type { Piece, Pin } from './board';
import type { Board } from './board';
import { getDirections, getDirectionsLength } from './directions';
export class MoveGenerator {
	me: number;
	board: Board;
	my_moves: number[];
	enemy_moves: number[];
	pins: Pin;
	checks: [number[]];

	constructor(pos: number, board: Board) {
		this.me = pos;
		this.board = board;
		this.my_moves = [];
		this.enemy_moves = [];
		this.checks = [[]];
		this.pins = { start: false, fix: [] };
	}

	run(): number[] {
		const my_piece = this.board.get(this.me);
		this.my_moves = this.findLegalMoves(this.me, 'regular');
		this.findEnemyMoves(my_piece.color);
		this.findPins(my_piece.color);
		const isCheck = this.is_check();
		if (this.me == this.board.getKing(my_piece.color).pos) {
			this.fixKingCheck(isCheck);
		} else if (this.pins.start == true) {
			this.fixPin(isCheck);
		} else if (isCheck) {
			this.fixCheck();
		}
		return this.my_moves;
	}

	findEnemyMoves(color: string): void {
		const pieces: Piece[] = this.board.getAllPieces(this.board.getEnemyColor(color));
		for (const piece of pieces) {
			const moves = this.findLegalMoves(piece.pos, 'check');
			this.enemy_moves = this.enemy_moves.concat(moves);
		}
	}

	findPins(color: string): void {
		const king = this.board.getKing(color);
		if (king.pos != this.me) {
			this.findLegalMoves(king.pos, 'pins');
		} else {
			this.pins = { start: false, fix: [] };
		}
	}

	findLegalMoves(pos: number, typeOfSearch: string): number[] {
		const my_piece = this.board.get(pos);
		const directions = getDirections(my_piece);
		const length = getDirectionsLength(my_piece, typeOfSearch);
		let my_moves = [];
		let dir_moves = [];
		for (const direction of directions) {
			my_moves = my_moves.concat(dir_moves);
			dir_moves = [];
			let new_pos = pos;
			this.resetPins();
			/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
			while (true) {
				new_pos += direction;
				// this square doesn't exist
				if (!this.board.inRange(new_pos)) {
					break;
				} else {
					const other_piece = this.board.get(new_pos);
					if (other_piece.name == 'none') {
						// this is free square
						dir_moves.push(new_pos);
					} else if (other_piece.name == 'plynth') {
						// this is just for night
						if (my_piece.name == 'night') {
							dir_moves.push(new_pos);
							break;
						}
						break;
					} else if (other_piece.color == my_piece.color) {
						// this is me vs me
						if (typeOfSearch == 'check') {
							dir_moves.push(new_pos);
						} else if (typeOfSearch == 'pins') {
							if (new_pos == this.me) {
								this.pins.start = true;
								continue;
							} else {
								dir_moves = [];
							}
						}
						break;
					} else {
						// this is enemy
						if (typeOfSearch == 'regular') {
							dir_moves.push(new_pos);
							break;
						} else if (typeOfSearch == 'check') {
							if (other_piece.name == 'king') {
								dir_moves.push(new_pos);
								dir_moves.push(pos);
								this.checks.push(dir_moves);
								dir_moves = [];
								continue;
							}
						} else if (typeOfSearch == 'pins') {
							if (this.pins.start) {
								dir_moves.push(new_pos);
								this.pins.fix = dir_moves;
								dir_moves = [];
								return [];
							} else {
								break;
							}
						}
						dir_moves.push(new_pos);
						break;
					}
				}
				if (length == true) {
					continue;
				} else {
					break;
				}
			}
		}
		my_moves = my_moves.concat(dir_moves);
		dir_moves = [];

		return my_moves;
	}

	resetPins(): void {
		this.pins.start = false;
		this.pins.fix = [];
	}

	is_check(): boolean {
		const checks = this.checks.filter((item) => item.length > 0);
		if (checks.length > 0) {
			return true;
		}
		return false;
	}

	fixKingCheck(isCheck: boolean): void {
		const checks = this.checks.filter((item) => item.length > 0);
		if (isCheck) {
			for (const check of checks) {
				this.my_moves = this.my_moves.filter((item) => !check.includes(item));
				if (this.my_moves.length == 0) {
					break;
				}
			}
		}
		this.my_moves = this.my_moves.filter((item) => !this.enemy_moves.includes(item));
	}

	fixPin(isCheck: boolean): void {
		this.my_moves = this.pins.fix;
		if (isCheck) {
			this.fixCheck();
		}
	}

	fixCheck(): void {
		const checks = this.checks.filter((item) => item.length > 0);
		for (const check of checks) {
			this.my_moves = this.my_moves.filter((item) => check.includes(item));
			if (this.my_moves.length == 0) {
				break;
			}
		}
	}
}
