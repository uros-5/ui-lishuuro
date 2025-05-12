import * as z from 'valibot'
import { MessageType } from './messageType'

export type GameType =
  | {
      vs_ai: number
    }
  | { vs_friend: string }

export type GameRequest = {
  t: MessageType.AddGameRequest
  d: {
    minutes: number
    incr: number
    variant: number
    sub_variant: number
    color: number
    game_type: GameType
  }
}

export type ChangeRoom = {
  t: MessageType.ChangeRoom
  d: 'home' | 'tv' | `/game/${string}` | ''
}

export type GetHand = {
  t: MessageType.GetHand
  d: null
}

export type GameMove = {
  t:
    | MessageType.SelectMove
    | MessageType.PlacePiece
    | MessageType.MovePiece
    | MessageType.ConfirmSelection
  d: string
}

export type GameControl = {
  t: MessageType.Draw | MessageType.Resign
  d: null
}

export type GetTv = {
  t: MessageType.GetTv
  d: null
}

export type SaveState = {
  t: MessageType.SaveState
  d: null
}
