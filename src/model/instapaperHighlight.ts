export interface BookmarkHighLights
{
    BookmarkId: number;
    EvernoteNoteId: string,
    EvernoteLastUpdated: Number,
    Title: string;
    HighlightText: HighlightText[]
}

export interface HighlightText{
    highlightId: string,
    text: string,
    time: Number
}
