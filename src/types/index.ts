//Document types
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
//Label and Annotation types
export interface Label{
    id: string;
    name: string;
    color: string;
    order: number;
}
export interface Annotation{
    id: string;
    documentId: string;
    startIndex: number;
    endIndex: number;
    text: string;
    labelId: string;
    pageNumber: number;
    createdAt: Date;
}
// Chat and Conversation types
export interface ChatMessage{
    id: string
    documentId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}
