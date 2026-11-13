import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, DEFAULT_ADMIN_EMAIL } from './firebase';
import {
  ContactSettings,
  SocialSettings,
  DirectorProfile,
  TeacherProfile,
  Slide,
  BookingSubmission,
  LeaderboardEntry,
  Course,
  QuizQuestion,
  UserProfile,
  Certificate,
  PaymentSettings,
  OnlineBatch,
  StudyNote,
  NoteOrder,
} from './types';
import {
  INITIAL_CONTACT_SETTINGS,
  INITIAL_SOCIAL_SETTINGS,
  INITIAL_DIRECTOR_PROFILE,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  SECURE_QUIZ_DATABASE,
  INITIAL_SLIDES,
  INITIAL_BOOKINGS,
  INITIAL_LEADERBOARD,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_ONLINE_BATCHES,
  INITIAL_STUDY_NOTES,
} from './dataStore';

// 1. Contact Settings
export function subscribeContactSettings(callback: (data: ContactSettings) => void) {
  const ref = doc(db, 'settings', 'contact');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as ContactSettings);
      } else {
        callback(INITIAL_CONTACT_SETTINGS);
      }
    },
    (err) => {
      console.warn('[Firestore] Contact listener warning:', err.message);
      callback(INITIAL_CONTACT_SETTINGS);
    }
  );
}

export async function updateContactSettings(data: Partial<ContactSettings>) {
  try {
    const ref = doc(db, 'settings', 'contact');
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/contact');
    throw err;
  }
}

// 2. Social Settings
export function subscribeSocialSettings(callback: (data: SocialSettings) => void) {
  const ref = doc(db, 'settings', 'social');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as SocialSettings);
      } else {
        callback(INITIAL_SOCIAL_SETTINGS);
      }
    },
    (err) => {
      console.warn('[Firestore] Social listener warning:', err.message);
      callback(INITIAL_SOCIAL_SETTINGS);
    }
  );
}

export async function updateSocialSettings(data: Partial<SocialSettings>) {
  try {
    const ref = doc(db, 'settings', 'social');
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/social');
    throw err;
  }
}

// 3. Admin Emails List
export function subscribeAdminEmails(callback: (emails: string[]) => void) {
  const ref = doc(db, 'settings', 'admins');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        callback(Array.isArray(d.emails) ? d.emails : [DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com']);
      } else {
        callback([DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com']);
      }
    },
    (err) => {
      console.warn('[Firestore] Admin emails listener warning:', err.message);
      callback([DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com']);
    }
  );
}

export async function updateAdminEmails(emails: string[]) {
  try {
    const ref = doc(db, 'settings', 'admins');
    await setDoc(ref, { emails, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/admins');
    throw err;
  }
}

// 4. Director Profile
export function subscribeDirector(callback: (director: DirectorProfile) => void) {
  const ref = doc(db, 'director', 'main');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as DirectorProfile);
      } else {
        callback(INITIAL_DIRECTOR_PROFILE);
      }
    },
    (err) => {
      console.warn('[Firestore] Director listener warning:', err.message);
      callback(INITIAL_DIRECTOR_PROFILE);
    }
  );
}

export async function updateDirector(data: Partial<DirectorProfile>) {
  try {
    const ref = doc(db, 'director', 'main');
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'director/main');
    throw err;
  }
}

// 5. Teachers Profile
export function subscribeTeachers(callback: (teachers: TeacherProfile[]) => void) {
  const colRef = collection(db, 'teachers');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: TeacherProfile[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as TeacherProfile));
        list.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        callback(list);
      } else {
        callback(INITIAL_TEACHERS);
      }
    },
    (err) => {
      console.warn('[Firestore] Teachers listener warning:', err.message);
      callback(INITIAL_TEACHERS);
    }
  );
}

export async function saveTeacher(teacher: TeacherProfile) {
  try {
    const ref = doc(db, 'teachers', teacher.id);
    await setDoc(ref, teacher, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `teachers/${teacher.id}`);
    throw err;
  }
}

export async function deleteTeacher(id: string) {
  try {
    await deleteDoc(doc(db, 'teachers', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `teachers/${id}`);
    throw err;
  }
}

// 6. Courses Management
export function subscribeCourses(callback: (courses: Course[]) => void) {
  const colRef = collection(db, 'courses');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: Course[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Course));
        list.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        callback(list);
      } else {
        callback(INITIAL_COURSES);
      }
    },
    (err) => {
      console.warn('[Firestore] Courses listener warning:', err.message);
      callback(INITIAL_COURSES);
    }
  );
}

export async function saveCourse(course: Course) {
  try {
    const ref = doc(db, 'courses', course.id);
    await setDoc(ref, course, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `courses/${course.id}`);
    throw err;
  }
}

export async function deleteCourse(id: string) {
  try {
    await deleteDoc(doc(db, 'courses', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `courses/${id}`);
    throw err;
  }
}

// 7. Quiz Questions Management
export function subscribeQuestions(callback: (questions: QuizQuestion[]) => void) {
  const colRef = collection(db, 'questions');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: QuizQuestion[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as QuizQuestion));
        list.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        callback(list);
      } else {
        callback(SECURE_QUIZ_DATABASE as unknown as QuizQuestion[]);
      }
    },
    (err) => {
      console.warn('[Firestore] Questions listener warning:', err.message);
      callback(SECURE_QUIZ_DATABASE as unknown as QuizQuestion[]);
    }
  );
}

export async function saveQuestion(q: QuizQuestion) {
  try {
    const ref = doc(db, 'questions', q.id);
    await setDoc(ref, q, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `questions/${q.id}`);
    throw err;
  }
}

export async function deleteQuestion(id: string) {
  try {
    await deleteDoc(doc(db, 'questions', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `questions/${id}`);
    throw err;
  }
}

// 8. Student User Profile
export function subscribeUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  if (!uid) return () => {};
  const ref = doc(db, 'users', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('[Firestore] User profile listener warning:', err.message);
      callback(null);
    }
  );
}

export async function saveUserProfile(profile: UserProfile) {
  try {
    const ref = doc(db, 'users', profile.uid);
    await setDoc(ref, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${profile.uid}`);
    throw err;
  }
}

// 9. Certificates (Merit Top 10 & Course Completion)
export function subscribeUserCertificates(userId: string, callback: (certs: Certificate[]) => void) {
  const colRef = collection(db, 'certificates');
  return onSnapshot(
    colRef,
    (snap) => {
      const list: Certificate[] = [];
      snap.forEach((d) => {
        const c = { id: d.id, ...d.data() } as Certificate;
        if (c.userId === userId) {
          list.push(c);
        }
      });
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] Certificates listener warning:', err.message);
      callback([]);
    }
  );
}

export function subscribeAllCertificates(callback: (certs: Certificate[]) => void) {
  const colRef = collection(db, 'certificates');
  return onSnapshot(
    colRef,
    (snap) => {
      const list: Certificate[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Certificate));
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] All certificates listener warning:', err.message);
      callback([]);
    }
  );
}

export async function issueCertificate(cert: Certificate) {
  try {
    const ref = doc(db, 'certificates', cert.id);
    await setDoc(ref, cert, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `certificates/${cert.id}`);
    throw err;
  }
}

export async function deleteCertificate(id: string) {
  try {
    await deleteDoc(doc(db, 'certificates', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `certificates/${id}`);
    throw err;
  }
}

// 10. Slides
export function subscribeSlides(callback: (slides: Slide[]) => void) {
  const colRef = collection(db, 'slides');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: Slide[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Slide));
        list.sort((a, b) => a.displayOrder - b.displayOrder);
        callback(list);
      } else {
        callback(INITIAL_SLIDES);
      }
    },
    (err) => {
      console.warn('[Firestore] Slides listener warning:', err.message);
      callback(INITIAL_SLIDES);
    }
  );
}

export async function saveSlide(slide: Slide) {
  try {
    const ref = doc(db, 'slides', slide.id);
    await setDoc(ref, slide, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `slides/${slide.id}`);
    throw err;
  }
}

export async function deleteSlide(id: string) {
  try {
    await deleteDoc(doc(db, 'slides', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `slides/${id}`);
    throw err;
  }
}

// 11. Bookings (Admissions) - Admin only
export function subscribeBookings(callback: (bookings: BookingSubmission[]) => void) {
  const colRef = collection(db, 'bookings');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: BookingSubmission[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BookingSubmission));
        callback(list);
      } else {
        callback(INITIAL_BOOKINGS);
      }
    },
    (err) => {
      console.warn('[Firestore] Bookings subscription info:', err.message);
      callback(INITIAL_BOOKINGS);
    }
  );
}

export async function addBooking(booking: BookingSubmission) {
  try {
    const ref = doc(db, 'bookings', booking.id);
    await setDoc(ref, booking);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `bookings/${booking.id}`);
    throw err;
  }
}

export async function updateBookingStatus(id: string, status: 'Pending' | 'Approved' | 'Contacted') {
  try {
    const ref = doc(db, 'bookings', id);
    await setDoc(ref, { status }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`);
    throw err;
  }
}

// 12. Leaderboard (Top 10)
export function subscribeLeaderboard(callback: (list: LeaderboardEntry[]) => void) {
  const colRef = collection(db, 'leaderboard');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: LeaderboardEntry[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as LeaderboardEntry));
        list.sort((a, b) => b.score - a.score);
        callback(list.slice(0, 10));
      } else {
        callback(INITIAL_LEADERBOARD.slice(0, 10));
      }
    },
    (err) => {
      console.warn('[Firestore] Leaderboard listener warning:', err.message);
      callback(INITIAL_LEADERBOARD.slice(0, 10));
    }
  );
}

export async function addLeaderboardScore(entry: LeaderboardEntry) {
  try {
    const ref = doc(db, 'leaderboard', entry.id);
    await setDoc(ref, entry);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `leaderboard/${entry.id}`);
    throw err;
  }
}

// 13. Payment Settings (bKash, Nagad, Bank Account)
export function subscribePaymentSettings(callback: (data: PaymentSettings) => void) {
  const ref = doc(db, 'settings', 'payment');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as PaymentSettings);
      } else {
        callback(INITIAL_PAYMENT_SETTINGS);
      }
    },
    (err) => {
      console.warn('[Firestore] Payment settings listener warning:', err.message);
      callback(INITIAL_PAYMENT_SETTINGS);
    }
  );
}

export async function updatePaymentSettings(data: Partial<PaymentSettings>) {
  try {
    const ref = doc(db, 'settings', 'payment');
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/payment');
    throw err;
  }
}

// 14. Online Batches Management
export function subscribeOnlineBatches(callback: (batches: OnlineBatch[]) => void) {
  const colRef = collection(db, 'onlineBatches');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: OnlineBatch[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as OnlineBatch));
        list.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        callback(list);
      } else {
        callback(INITIAL_ONLINE_BATCHES);
      }
    },
    (err) => {
      console.warn('[Firestore] OnlineBatches listener warning:', err.message);
      callback(INITIAL_ONLINE_BATCHES);
    }
  );
}

export async function saveOnlineBatch(batch: OnlineBatch) {
  try {
    const ref = doc(db, 'onlineBatches', batch.id);
    await setDoc(ref, batch, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `onlineBatches/${batch.id}`);
    throw err;
  }
}

export async function deleteOnlineBatch(id: string) {
  try {
    await deleteDoc(doc(db, 'onlineBatches', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `onlineBatches/${id}`);
    throw err;
  }
}

// 15. Study Notes (Free Hook Notes + Paid Full Notes)
export function subscribeNotes(callback: (notes: StudyNote[]) => void) {
  const colRef = collection(db, 'notes');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: StudyNote[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as StudyNote));
        list.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        callback(list);
      } else {
        callback(INITIAL_STUDY_NOTES);
      }
    },
    (err) => {
      console.warn('[Firestore] Notes listener warning:', err.message);
      callback(INITIAL_STUDY_NOTES);
    }
  );
}

export async function saveNote(note: StudyNote) {
  try {
    const ref = doc(db, 'notes', note.id);
    await setDoc(ref, note, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `notes/${note.id}`);
    throw err;
  }
}

export async function deleteNote(id: string) {
  try {
    await deleteDoc(doc(db, 'notes', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `notes/${id}`);
    throw err;
  }
}

// 16. Paid Note Orders (Purchase & Delivery tracking)
export function subscribeNoteOrders(callback: (orders: NoteOrder[]) => void) {
  const colRef = collection(db, 'noteOrders');
  return onSnapshot(
    colRef,
    (snap) => {
      const list: NoteOrder[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as NoteOrder));
      list.sort((a, b) => b.id.localeCompare(a.id));
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] NoteOrders listener warning:', err.message);
      callback([]);
    }
  );
}

export async function addNoteOrder(order: NoteOrder) {
  try {
    const ref = doc(db, 'noteOrders', order.id);
    await setDoc(ref, order);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `noteOrders/${order.id}`);
    throw err;
  }
}

export async function updateNoteOrderStatus(id: string, status: 'Pending' | 'Delivered') {
  try {
    const ref = doc(db, 'noteOrders', id);
    await setDoc(ref, { status }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `noteOrders/${id}`);
    throw err;
  }
}

export async function deleteNoteOrder(id: string) {
  try {
    await deleteDoc(doc(db, 'noteOrders', id));
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `noteOrders/${id}`);
    throw err;
  }
}

// 17. Logged-in Student's Own Bookings (for Online Batch Classroom Access)
export function subscribeUserBookings(uid: string, callback: (bookings: BookingSubmission[]) => void) {
  if (!uid) return () => {};
  const q = query(collection(db, 'bookings'), where('userId', '==', uid));
  return onSnapshot(
    q,
    (snap) => {
      const list: BookingSubmission[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BookingSubmission));
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] UserBookings listener warning:', err.message);
      callback([]);
    }
  );
}

// 18. Admin Batch Seed Utility
export async function seedInitialDataToFirestore() {
  try {
    await setDoc(doc(db, 'settings', 'contact'), INITIAL_CONTACT_SETTINGS, { merge: true });
    await setDoc(doc(db, 'settings', 'social'), INITIAL_SOCIAL_SETTINGS, { merge: true });
    await setDoc(doc(db, 'settings', 'payment'), INITIAL_PAYMENT_SETTINGS, { merge: true });
    await setDoc(doc(db, 'settings', 'admins'), {
      emails: [DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com'],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await setDoc(doc(db, 'director', 'main'), INITIAL_DIRECTOR_PROFILE, { merge: true });

    for (const t of INITIAL_TEACHERS) {
      await setDoc(doc(db, 'teachers', t.id), t, { merge: true });
    }
    for (const c of INITIAL_COURSES) {
      await setDoc(doc(db, 'courses', c.id), c, { merge: true });
    }
    for (const ob of INITIAL_ONLINE_BATCHES) {
      await setDoc(doc(db, 'onlineBatches', ob.id), ob, { merge: true });
    }
    for (const n of INITIAL_STUDY_NOTES) {
      await setDoc(doc(db, 'notes', n.id), n, { merge: true });
    }
    for (const q of SECURE_QUIZ_DATABASE) {
      await setDoc(doc(db, 'questions', q.id), q, { merge: true });
    }
    for (const s of INITIAL_SLIDES) {
      await setDoc(doc(db, 'slides', s.id), s, { merge: true });
    }
    for (const lb of INITIAL_LEADERBOARD) {
      await setDoc(doc(db, 'leaderboard', lb.id), lb, { merge: true });
    }
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'batch/seed');
    throw err;
  }
}
