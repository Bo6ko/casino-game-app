export type Symbols = 'череша' | 'круша' | 'ябълка' | 'диня' | 'пъпеш';

export type MatrixResponse = {
    matrix: string[][],
    winning: number
}

export type Sim = {
    count: number,
    bet: number
}

export type SimResponse = {
    totalWinnings: number,
    netResult: number
}
