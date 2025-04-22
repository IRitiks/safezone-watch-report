
// Type declarations for Firebase Auth
declare module 'firebase/auth' {
  export function signInWithEmailAndPassword(/* params */): Promise<any>;
  export function createUserWithEmailAndPassword(/* params */): Promise<any>;
  export function onAuthStateChanged(/* params */): any;
  export function signOut(/* params */): Promise<void>;
  export interface User {}
}
