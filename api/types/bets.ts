export type BetsType = {
    id?: number,
    bet: number,
    winning: number,
    created_at?: Date,
    updated_at?: Date
}

export type Rtp = {
    totalBet: number,
    totalWinning: number
}
