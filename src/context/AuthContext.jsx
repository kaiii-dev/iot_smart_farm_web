import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { collection, query, where, limit, getDocs, runTransaction, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [customUserId, setCustomUserId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user)
        // Look up the Firestore USER_XXX doc by Firebase Auth UID
        const q = query(collection(db, 'users'), where('uid', '==', user.uid), limit(1))
        const snap = await getDocs(q)
        if (!snap.empty) {
          const docSnap = snap.docs[0]
          setCustomUserId(docSnap.id)
          setUserData(docSnap.data())
        } else {
          // No Firestore doc yet (shouldn't happen after register, but handle gracefully)
          setCustomUserId(null)
          setUserData(null)
        }
      } else {
        setFirebaseUser(null)
        setCustomUserId(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, customUserId, userData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

// Shared helper: get next USER_XXX id using a Firestore transaction
export async function getNextUserId() {
  const counterRef = doc(db, 'counters', 'users')
  let nextId = ''
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef)
    let count = snap.exists() ? (snap.data().count ?? 0) : 0
    count++
    nextId = `USER_${String(count).padStart(3, '0')}`
    tx.set(counterRef, { count }, { merge: true })
  })
  return nextId
}

// Shared helper: create user doc in Firestore
export async function createUserDoc(uid, name, email, photoURL = null) {
  // Check if doc already exists
  const q = query(collection(db, 'users'), where('uid', '==', uid), limit(1))
  const existing = await getDocs(q)
  if (!existing.empty) return existing.docs[0].id

  const customId = await getNextUserId()
  const data = {
    uid,
    name,
    email,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  }
  if (photoURL) data.photoURL = photoURL
  await setDoc(doc(db, 'users', customId), data)
  return customId
}
