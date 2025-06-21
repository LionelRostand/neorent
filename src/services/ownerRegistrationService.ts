
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OwnerRegistrationRequest } from '@/types/ownerRegistration';

export const ownerRegistrationService = {
  async fetchRequests(): Promise<OwnerRegistrationRequest[]> {
    const querySnapshot = await getDocs(collection(db, 'owner_registration_requests'));
    const requestsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OwnerRegistrationRequest[];
    
    return requestsData.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async rejectRequest(requestId: string): Promise<void> {
    await updateDoc(doc(db, 'owner_registration_requests', requestId), {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  },

  async deleteRequest(requestId: string): Promise<void> {
    await deleteDoc(doc(db, 'owner_registration_requests', requestId));
  },

  async updateRequestStatus(requestId: string, firebaseUid: string, temporaryPassword: string): Promise<void> {
    await updateDoc(doc(db, 'owner_registration_requests', requestId), {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      firebaseUid: firebaseUid,
      temporaryPassword: temporaryPassword
    });
  }
};
