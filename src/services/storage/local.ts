// src/services/storage/local.ts

import type { Document, Annotation, Label, ChatMessage } from '../../types'
import type { StorageService } from './interface'

export class LocalStorageService implements StorageService {

  // Document operations
  async saveDocument(doc: Document): Promise<void> {
    localStorage.setItem(`doc:${doc.id}`, JSON.stringify(doc))
    
    // Also maintain an index of all document ids
    const index = this.getDocumentIndex()
    if (!index.includes(doc.id)) {
      index.push(doc.id)
      localStorage.setItem('doc:index', JSON.stringify(index))
    }
  }

  async getDocument(id: string): Promise<Document> {
    const raw = localStorage.getItem(`doc:${id}`)
    if (!raw) throw new Error(`Document not found: ${id}`)
    return JSON.parse(raw) as Document
  }

  async getAllDocuments(): Promise<Document[]> {
    const index = this.getDocumentIndex()
    return index.map(id => {
      const raw = localStorage.getItem(`doc:${id}`)
      if (!raw) throw new Error(`Document not found: ${id}`)
      return JSON.parse(raw) as Document
    })
  }

  async deleteDocument(id: string): Promise<void> {
    localStorage.removeItem(`doc:${id}`)
    
    // Remove from index
    const index = this.getDocumentIndex().filter(docId => docId !== id)
    localStorage.setItem('doc:index', JSON.stringify(index))
    
    // Clean up associated data
    const annotations = await this.getAnnotations(id)
    annotations.forEach(a => localStorage.removeItem(`annotation:${a.id}`))
    localStorage.removeItem(`annotations:${id}`)
    localStorage.removeItem(`chat:${id}`)
  }

  // Annotation operations
  async saveAnnotation(annotation: Annotation): Promise<void> {
    localStorage.setItem(`annotation:${annotation.id}`, JSON.stringify(annotation))
    
    // Also maintain an index of annotations per document
    const index = this.getAnnotationIndex(annotation.documentId)
    if (!index.includes(annotation.id)) {
      index.push(annotation.id)
      localStorage.setItem(`annotations:${annotation.documentId}`, JSON.stringify(index))
    }
  }

  async getAnnotations(documentId: string): Promise<Annotation[]> {
    const index = this.getAnnotationIndex(documentId)
    return index.map(id => {
      const raw = localStorage.getItem(`annotation:${id}`)
      if (!raw) throw new Error(`Annotation not found: ${id}`)
      return JSON.parse(raw) as Annotation
    })
  }

  async deleteAnnotation(id: string): Promise<void> {
    const raw = localStorage.getItem(`annotation:${id}`)
    if (!raw) return
    
    const annotation = JSON.parse(raw) as Annotation
    localStorage.removeItem(`annotation:${id}`)
    
    // Remove from document's annotation index
    const index = this.getAnnotationIndex(annotation.documentId)
      .filter(annotationId => annotationId !== id)
    localStorage.setItem(`annotations:${annotation.documentId}`, JSON.stringify(index))
  }

  // Label operations
  async saveLabel(label: Label): Promise<void> {
    localStorage.setItem(`label:${label.id}`, JSON.stringify(label))
    
    const index = this.getLabelIndex()
    if (!index.includes(label.id)) {
      index.push(label.id)
      localStorage.setItem('label:index', JSON.stringify(index))
    }
  }

  async getLabels(): Promise<Label[]> {
    const index = this.getLabelIndex()
    return index
      .map(id => {
        const raw = localStorage.getItem(`label:${id}`)
        if (!raw) return null
        return JSON.parse(raw) as Label
      })
      .filter(Boolean) as Label[]
  }

  async deleteLabel(id: string): Promise<void> {
    localStorage.removeItem(`label:${id}`)
    const index = this.getLabelIndex().filter(labelId => labelId !== id)
    localStorage.setItem('label:index', JSON.stringify(index))
  }

  // Chat operations
  async saveChatMessage(message: ChatMessage): Promise<void> {
    const history = await this.getChatHistory(message.documentId)
    history.push(message)
    localStorage.setItem(`chat:${message.documentId}`, JSON.stringify(history))
  }

  async getChatHistory(documentId: string): Promise<ChatMessage[]> {
    const raw = localStorage.getItem(`chat:${documentId}`)
    if (!raw) return []
    return JSON.parse(raw) as ChatMessage[]
  }

  async clearChatHistory(documentId: string): Promise<void> {
    localStorage.removeItem(`chat:${documentId}`)
  }

  // Private index helpers
  private getDocumentIndex(): string[] {
    const raw = localStorage.getItem('doc:index')
    return raw ? JSON.parse(raw) : []
  }

  private getAnnotationIndex(documentId: string): string[] {
    const raw = localStorage.getItem(`annotations:${documentId}`)
    return raw ? JSON.parse(raw) : []
  }

  private getLabelIndex(): string[] {
    const raw = localStorage.getItem('label:index')
    return raw ? JSON.parse(raw) : []
  }
}