// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjB9MpTbzETRZnYjrYNjbleXGKvuqCxKw",
  authDomain: "fir-b-a-3eb1a.firebaseapp.com",
  projectId: "fir-b-a-3eb1a",
  storageBucket: "fir-b-a-3eb1a.firebasestorage.app",
  messagingSenderId: "1070672939917",
  appId: "1:1070672939917:web:64435f3b09ccd114830bc4",
  measurementId: "G-Z0M8NM4BNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
window.firebase = {
  auth,
  db,
  storage,
  // Auth functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  // Firestore functions
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Helper functions for common operations
window.firebaseHelpers = {
  // Authentication helpers
  async signUp(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: username
      });

      // Create user profile document with both username and email
      await addDoc(collection(db, 'user_profiles'), {
        uid: user.uid,
        email: user.email,
        username: username,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // User profile helpers
  async getUserProfile(uid) {
    try {
      const q = query(collection(db, 'user_profiles'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { data: { id: doc.id, ...doc.data() }, error: null };
      } else {
        return { data: null, error: { message: 'User profile not found' } };
      }
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUserProfile(uid, data) {
    try {
      const q = query(collection(db, 'user_profiles'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date()
        });
        return { error: null };
      } else {
        return { error: { message: 'User profile not found' } };
      }
    } catch (error) {
      return { error };
    }
  },

  async createUserProfile(uid, data) {
    try {
      // Create user profile document
      await addDoc(collection(db, 'user_profiles'), {
        uid: uid,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // PPP Loans helpers
  async createLoan(loanData) {
    try {
      // Map field names to Firebase format (using snake_case for consistency)
      const firebaseData = {
        loan_number: loanData.loan_number,
        loan_amount: loanData.loan_amount,
        processing_fee: loanData.processing_fee || 0,
        status: loanData.status,
        lender_name: loanData.lender_name,
        loan_date: loanData.loan_date,
        created_at: loanData.created_at || new Date().toISOString(),
        updated_at: loanData.updated_at || new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'ppp_loans'), firebaseData);
      return { data: { id: docRef.id, ...firebaseData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getLoanByNumber(loanNumber) {
    try {
      const q = query(collection(db, 'ppp_loans'), where('loan_number', '==', loanNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { data: { id: doc.id, ...doc.data() }, error: null };
      } else {
        return { data: null, error: { message: 'Loan not found' } };
      }
    } catch (error) {
      return { data: null, error };
    }
  },

  async getLoans() {
    try {
      const q = query(collection(db, 'ppp_loans'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const loans = [];

      querySnapshot.forEach((doc) => {
        loans.push({ id: doc.id, ...doc.data() });
      });

      return { data: loans, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async updateLoan(loanId, loanData) {
    try {
      const docRef = doc(db, 'ppp_loans', loanId);
      await updateDoc(docRef, {
        ...loanData,
        updatedAt: new Date()
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async deleteLoan(loanId) {
    try {
      await deleteDoc(doc(db, 'ppp_loans', loanId));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // PPP Requests helpers
  async createRequest(requestData) {
    try {
      // Map field names to Firebase format
      const firebaseData = {
        userId: requestData.user_id || requestData.userId,
        businessName: requestData.business_name || requestData.businessName,
        pppLoanNumber: requestData.ppp_loan_number || requestData.pppLoanNumber,
        requestStatus: requestData.request_status || requestData.requestStatus || 'draft',
        contactEmail: requestData.contact_email || requestData.contactEmail,
        contactFirstName: requestData.contact_first_name || requestData.contactFirstName,
        contactLastName: requestData.contact_last_name || requestData.contactLastName,
        businessAddress: requestData.business_address || requestData.businessAddress,
        businessCity: requestData.business_city || requestData.businessCity,
        businessState: requestData.business_state || requestData.businessState,
        businessZip: requestData.business_zip || requestData.businessZip,
        businessPhone: requestData.business_phone || requestData.businessPhone,
        ein: requestData.ein,
        naicsCode: requestData.naics_code || requestData.naicsCode,
        businessType: requestData.business_type || requestData.businessType,
        averageEmployees: requestData.average_employees || requestData.averageEmployees,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'ppp_requests'), firebaseData);
      return { data: { id: docRef.id, ...firebaseData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getRequests() {
    try {
      const q = query(collection(db, 'ppp_requests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: requests, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getUserRequests(uid) {
    try {
      const q = query(
        collection(db, 'ppp_requests'), 
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: requests, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async updateRequest(requestId, requestData) {
    try {
      const docRef = doc(db, 'ppp_requests', requestId);
      await updateDoc(docRef, {
        ...requestData,
        updatedAt: new Date()
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Forgiveness request helpers
  async saveForgivenessRequest(requestData) {
    try {
      const firebaseData = {
        userId: requestData.userId,
        taxId: requestData.taxId,
        loanAmount: requestData.loanAmount,
        pppLoanNumber: requestData.pppLoanNumber,
        lenderName: requestData.lenderName,
        loanDate: requestData.loanDate,
        processingFee: requestData.processingFee || 0,
        employeeCount: requestData.employeeCount,
        businessName: requestData.businessName,
        dbaName: requestData.dbaName || null,
        businessAddress: requestData.businessAddress,
        businessCity: requestData.businessCity,
        businessState: requestData.businessState,
        businessZip: requestData.businessZip,
        contactPhone: requestData.contactPhone,
        contactEmail: requestData.contactEmail,
        businessType: requestData.businessType,
        // Personal information
        personalInfo: requestData.personalInfo || null,
        // Documents (Cloudinary URLs)
        documents: requestData.documents || null,
        requestStatus: requestData.requestStatus || 'submitted',
        submittedAt: requestData.submittedAt || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'forgiveness_requests'), firebaseData);
      return { data: { id: docRef.id, ...firebaseData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getForgivenessRequests(uid) {
    try {
      console.log('Querying forgiveness requests for UID:', uid);
      // Remove orderBy to avoid index requirement - we'll sort in JavaScript instead
      const q = query(
        collection(db, 'forgiveness_requests'),
        where('userId', '==', uid)
      );
      const querySnapshot = await getDocs(q);
      const requests = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Found request document:', { id: doc.id, userId: data.userId, ...data });
        requests.push({ id: doc.id, ...data });
      });

      // Sort by createdAt in JavaScript instead of Firestore
      requests.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bDate - aDate; // Descending order (newest first)
      });

      console.log('Total requests found:', requests.length);
      return { data: requests, error: null };
    } catch (error) {
      console.error('Error fetching forgiveness requests:', error);
      return { data: [], error };
    }
  },

  async updateForgivenessRequest(requestId, updateData) {
    try {
      const docRef = doc(db, 'forgiveness_requests', requestId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },





  // DUPLICATE FUNCTION - COMMENTED OUT
  /*
  async getForgivenessRequests(uid) {
    try {
      const q = query(
        collection(db, 'forgiveness_requests'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];

      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      return { data: requests, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },
  */

  async getAllForgivenessRequests() {
    try {
      console.log('Fetching all forgiveness requests...');
      const q = query(
        collection(db, 'forgiveness_requests'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('All requests - Found document:', { id: doc.id, userId: data.userId, businessName: data.businessName });
        requests.push({ id: doc.id, ...data });
      });

      console.log('Total requests in database:', requests.length);
      return { data: requests, error: null };
    } catch (error) {
      console.error('Error fetching all forgiveness requests:', error);
      return { data: [], error };
    }
  },

  // File upload helpers
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, error: null };
    } catch (error) {
      return { url: null, error };
    }
  },

  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Utility functions
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  formatDate(date) {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  }
};

console.log('Firebase initialized successfully');
