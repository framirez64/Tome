import type {Document,Annotation,Label,ChatMessage} from '../../types';

export interface StorageService{
    saveDocument(document: Document): Promise<void>;
    getDocument(documentId: string): Promise<Document | null>;
    getAllDocuments(): Promise<Document[]>;
    deleteDocument(documentId: string): Promise<void>;

    saveAnnotation(annotation: Annotation): Promise<void>;
    getAnnotations(documentId: string): Promise<Annotation[]>;
    deleteAnnotation(annotationId: string): Promise<void>;

    saveLabel(label: Label): Promise<void>;
    getLabels(): Promise<Label[]>;
    deleteLabel(id: string): Promise<void>;

    saveChatMessage(message: ChatMessage): Promise<void>;
    getChatHistory(documentId: string): Promise<ChatMessage[]>;
    clearChatHistory(documentId: string): Promise<void>;
}