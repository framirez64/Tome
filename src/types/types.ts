export interface Page{
    pageNumber: number;
    text: string;
    offset: number;
}

export interface DocumentMetadata{
    uploadAt: Date;
    wordCount: number;
    pageCount: number;
    fileSize: number;
}
export interface Document{
    id: string;
    filename: string;
    fileType: 'txt' | 'pdf';
    fullText: string;
    metadata: DocumentMetadata;
    pages: Page[];
}