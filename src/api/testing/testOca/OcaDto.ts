export interface OcaDto{
    questId? : number
    questText? : string
}

export interface SavedAnswer {
    answerQuestId? : number
    answer? : string
    yes? : number
    no? : number
    maybe? : number
    type? : string
}