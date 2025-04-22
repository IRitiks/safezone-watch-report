
// Type declarations for Firebase Auth
declare module 'firebase/auth' {
  // Add minimal type definitions as needed
  export function signInWithEmailAndPassword(/* params */): Promise<any>;
  export function createUserWithEmailAndPassword(/* params */): Promise<any>;
  // Add other methods you're using
}
