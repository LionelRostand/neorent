
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { OwnerRegistrationRequest } from '@/types/ownerRegistration';

export const ownerAccountService = {
  generateTemporaryPassword(): string {
    return `Temp${Date.now().toString().slice(-6)}!`;
  },

  async createFirebaseAccount(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async findExistingUser(email: string) {
    const userRolesSnapshot = await getDocs(collection(db, 'user_roles'));
    return userRolesSnapshot.docs.find(doc => 
      doc.data().email === email
    );
  },

  async updateExistingProfile(existingUserId: string, request: OwnerRegistrationRequest, firebaseUid: string, temporaryPassword: string, userData: any) {
    const updatedProfile = {
      ...userData,
      role: 'owner' as const,
      userType: 'owner' as const,
      type: 'owner' as const,
      name: request.name,
      email: request.email,
      phone: request.phone || userData.phone || '',
      company: request.company || userData.company || '',
      address: request.address || userData.address || '',
      isOwner: true,
      isPropertyOwner: true,
      firebaseUid: firebaseUid,
      hasPassword: true,
      password: request.password,
      temporaryPassword: temporaryPassword,
      updatedAt: new Date().toISOString(),
      permissions: ['read', 'write', 'manage'],
      status: 'active'
    };

    await updateDoc(doc(db, 'user_roles', existingUserId), updatedProfile);
  },

  async createNewProfile(firebaseUid: string, request: OwnerRegistrationRequest, temporaryPassword: string) {
    const ownerProfile = {
      role: 'owner' as const,
      userType: 'owner' as const,
      type: 'owner' as const,
      email: request.email,
      name: request.name,
      createdAt: new Date().toISOString(),
      permissions: ['read', 'write', 'manage'],
      hasPassword: true,
      isOwner: true,
      isPropertyOwner: true,
      phone: request.phone || '',
      company: request.company || '',
      address: request.address || '',
      firebaseUid: firebaseUid,
      password: request.password,
      temporaryPassword: temporaryPassword,
      fromRegistrationRequest: true,
      status: 'active'
    };

    await setDoc(doc(db, 'user_roles', firebaseUid), ownerProfile);
  }
};
