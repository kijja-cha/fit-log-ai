import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db, COLLECTIONS } from '@/lib/firebase'
import {
  RunLog,
  StrengthSession,
  NutritionLog,
  UserProfile,
  LogFilter,
  ApiResponse,
} from '@/types'

/**
 * Generic Firebase service class following SOLID principles
 * S - Single Responsibility: Each method has one clear purpose
 * O - Open/Closed: Easily extensible for new collection types
 * L - Liskov Substitution: Methods work with base types and extensions
 * I - Interface Segregation: Clean, focused interface
 * D - Dependency Inversion: Depends on abstractions (Firestore interfaces)
 */
class FirebaseService {
  /**
   * Generic method to add a document to any collection
   */
  async addDocument<T>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<string>> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now,
      })

      return {
        data: docRef.id,
        success: true,
        message: 'Document created successfully',
      }
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error)
      return {
        data: '',
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generic method to get a document by ID
   */
  async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<ApiResponse<T | null>> {
    try {
      const docRef = doc(db, collectionName, documentId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          data: { id: docSnap.id, ...docSnap.data() } as T,
          success: true,
        }
      } else {
        return {
          data: null,
          success: true,
          message: 'Document not found',
        }
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error)
      return {
        data: null,
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generic method to update a document
   */
  async updateDocument<T>(
    collectionName: string,
    documentId: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<boolean>> {
    try {
      const docRef = doc(db, collectionName, documentId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })

      return {
        data: true,
        success: true,
        message: 'Document updated successfully',
      }
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error)
      return {
        data: false,
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generic method to delete a document
   */
  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const docRef = doc(db, collectionName, documentId)
      await deleteDoc(docRef)

      return {
        data: true,
        success: true,
        message: 'Document deleted successfully',
      }
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error)
      return {
        data: false,
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get documents with filtering, sorting, and pagination
   */
  async getDocuments<T>(
    collectionName: string,
    filters: LogFilter = {},
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<ApiResponse<T[]>> {
    try {
      const constraints: QueryConstraint[] = []

      // Add filters
      if (filters.dateFrom) {
        constraints.push(
          where('date', '>=', Timestamp.fromDate(filters.dateFrom))
        )
      }
      if (filters.dateTo) {
        constraints.push(
          where('date', '<=', Timestamp.fromDate(filters.dateTo))
        )
      }
      if (filters.feeling) {
        constraints.push(where('feeling', '==', filters.feeling))
      }
      if (filters.workoutType) {
        constraints.push(where('workoutType', '==', filters.workoutType))
      }

      // Add ordering
      constraints.push(orderBy(orderByField, orderDirection))

      // Add pagination
      if (lastDoc) {
        constraints.push(startAfter(lastDoc))
      }
      constraints.push(limit(limitCount))

      const q = query(collection(db, collectionName), ...constraints)
      const querySnapshot = await getDocs(q)

      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[]

      return {
        data: documents,
        success: true,
      }
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error)
      return {
        data: [],
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get user's documents from subcollection structure
   */
  async getUserDocuments<T>(
    collectionName: string,
    userId: string,
    filters: LogFilter = {},
    orderByField: string = 'date',
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount: number = 50
  ): Promise<ApiResponse<T[]>> {
    try {
      // Query subcollection structure: userId/{collectionName}
      const constraints: QueryConstraint[] = []

      // Add filters
      if (filters.dateFrom) {
        constraints.push(
          where('date', '>=', Timestamp.fromDate(filters.dateFrom))
        )
      }
      if (filters.dateTo) {
        constraints.push(
          where('date', '<=', Timestamp.fromDate(filters.dateTo))
        )
      }
      if (filters.feeling) {
        constraints.push(where('feeling', '==', filters.feeling))
      }
      if (filters.workoutType) {
        constraints.push(where('workoutType', '==', filters.workoutType))
      }

      // Add ordering
      constraints.push(orderBy(orderByField, orderDirection))
      constraints.push(limit(limitCount))

      // Query subcollection: users/{userId}/{collectionName}
      const subcollectionRef = collection(db, 'users', userId, collectionName)

      // Apply filters and ordering to subcollection query
      const q = query(subcollectionRef, ...constraints)
      const querySnapshot = await getDocs(q)

      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[]

      // Query completed successfully

      return {
        data: documents,
        success: true,
      }
    } catch (error) {
      console.error(
        `Error getting user documents from ${collectionName}:`,
        error
      )
      return {
        data: [],
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService()

// Specific service methods for different log types
export const runLogService = {
  create: (data: Omit<RunLog, 'id' | 'createdAt' | 'updatedAt'>) =>
    firebaseService.addDocument<RunLog>(COLLECTIONS.RUN_LOGS, data),

  getById: (id: string) =>
    firebaseService.getDocument<RunLog>(COLLECTIONS.RUN_LOGS, id),

  update: (
    id: string,
    data: Partial<Omit<RunLog, 'id' | 'createdAt' | 'updatedAt'>>
  ) => firebaseService.updateDocument<RunLog>(COLLECTIONS.RUN_LOGS, id, data),

  delete: (id: string) =>
    firebaseService.deleteDocument(COLLECTIONS.RUN_LOGS, id),

  getUserLogs: (userId: string, filters?: LogFilter, limit?: number) =>
    firebaseService.getUserDocuments<RunLog>(
      COLLECTIONS.RUN_LOGS,
      userId,
      filters,
      'date',
      'desc',
      limit
    ),
}

export const strengthSessionService = {
  create: (data: Omit<StrengthSession, 'id' | 'createdAt' | 'updatedAt'>) =>
    firebaseService.addDocument<StrengthSession>(
      COLLECTIONS.STRENGTH_SESSIONS,
      data
    ),

  getById: (id: string) =>
    firebaseService.getDocument<StrengthSession>(
      COLLECTIONS.STRENGTH_SESSIONS,
      id
    ),

  update: (
    id: string,
    data: Partial<Omit<StrengthSession, 'id' | 'createdAt' | 'updatedAt'>>
  ) =>
    firebaseService.updateDocument<StrengthSession>(
      COLLECTIONS.STRENGTH_SESSIONS,
      id,
      data
    ),

  delete: (id: string) =>
    firebaseService.deleteDocument(COLLECTIONS.STRENGTH_SESSIONS, id),

  getUserSessions: (userId: string, filters?: LogFilter, limit?: number) =>
    firebaseService.getUserDocuments<StrengthSession>(
      COLLECTIONS.STRENGTH_SESSIONS,
      userId,
      filters,
      'date',
      'desc',
      limit
    ),
}

export const userProfileService = {
  create: (data: Omit<UserProfile, 'createdAt'>) =>
    firebaseService.addDocument<UserProfile>(COLLECTIONS.USERS, data),

  getById: (id: string) =>
    firebaseService.getDocument<UserProfile>(COLLECTIONS.USERS, id),

  update: (id: string, data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>) =>
    firebaseService.updateDocument<UserProfile>(COLLECTIONS.USERS, id, data),

  delete: (id: string) => firebaseService.deleteDocument(COLLECTIONS.USERS, id),
}
