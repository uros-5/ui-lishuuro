export function range(): number[] {
	let squares: number[] = [];
	const xEdges = [0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176];
	for (const i of xEdges) {
		squares = squares.concat(new Array(12).fill(i).map((x, y) => x + y));
	}
	return squares;
}

export interface Piece {
	name: string;
	color: string;
	pos: number;
}

export interface Pin {
	start: boolean;
	fix: number[];
}

export enum TypeOfSearch {
	Regular,
	Check,
	Pin
}

export class Board {
	private board: Piece[] = [];
	private range: number[];

	constructor() {
		this.range = range();
		this.board.push({ name: 'queen', color: 'blue', pos: 54 });
		this.board.push({ name: 'king', color: 'blue', pos: 57 });
		this.board.push({ name: 'night', color: 'red', pos: 43 });
		this.board.push({ name: 'king', color: 'red', pos: 154 });
		//this.board.push({ name: 'rook', color: 'red', pos: 59 });
	}

	get(pos: number): Piece {
		const piece = this.board.find((piece) => piece.pos == pos);
		if (piece == undefined) {
			return { name: 'none', color: 'none', pos: -1 };
		} else {
			return piece;
		}
	}

	getKing(color: string): Piece {
		const piece = this.board.find((piece) => piece.color == color && piece.name == 'king');
		if (piece == undefined) {
			return { name: 'none', color: 'none', pos: -1 };
		}
		return piece;
	}

	getEnemyColor(color: string): string {
		if (color == 'blue') {
			return 'red';
		} else {
			return 'blue';
		}
	}

	inRange(pos: number): boolean {
		if (this.range.includes(pos)) {
			return true;
		} else return false;
	}

	getAllPieces(color: string): Piece[] {
		return this.board.filter((piece) => piece.color == color);
	}
}
