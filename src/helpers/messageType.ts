export enum MessageType {
    ChangeRoom,
    AddGameRequest,
    RedirectToGame,
    PlayerCount,
    GameCount,
    // game
    StartClock,
    GetGame,
    GetConfirmed,
    GetHistory,
    GetHand,
    SelectMove,
    PlacePiece,
    MovePiece,
    Draw,
    Resign,
    GameEnd,
    // tv
    GetTv,
    AddTvGame,
    NewTvMove,
    RemoveTVGame,
    SaveState,
    ReloadJinja,
    ConfirmSelection,
    NewPlayer = 200,
    
}
