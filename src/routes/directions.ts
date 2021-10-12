import type { Piece } from './board';
const ORTHOGONAL = [-1, 1, -16, 16];
const DIAGONAL = [-17, -15, 17, 15];
const JUMP = [31, 33, 14, 18, -14, -18, -31, -33];

export function getDirections(piece: Piece): number[] {
	if (['queen', 'king', 'pawn'].includes(piece.name)) {
		return [].concat(ORTHOGONAL).concat(DIAGONAL);
	}
	switch (piece.name) {
		case 'rook':
			return [].concat(ORTHOGONAL).concat(DIAGONAL);
		case 'bishop':
			return DIAGONAL;
		case 'night':
			return JUMP;
		case 'plynth':
			return [];
		default:
			return [];
	}
}

export function getDirectionsLength(piece: Piece, typeOfSearch: string): boolean {
	switch (piece.name) {
		case 'king':
			if (typeOfSearch == 'pins') {
				return true;
			}
			return false;
		case 'queen':
			return true;
		case 'rook':
			return true;
		case 'bishop':
			return true;
		case 'night':
			return false;
		case 'pawn':
			return false;
		default:
			return false;
	}
}
