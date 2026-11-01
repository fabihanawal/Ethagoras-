import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
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
} from './types';
import {
  INITIAL_CONTACT_SETTINGS,
  INITIAL_SOCIAL_SETTINGS,
  INITIAL_DIRECTOR_PROFILE,
  INITIAL_TEACHERS,
  INITIAL_SLIDES,
  INITIAL_BOOKINGS,
  INITIAL_LEADERBOARD,
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
      console.warn('[Firestore] Contact settings listener warning:', err.message);
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
      console.warn('[Firestore] Social settings listener warning:', err.message);
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

// 6. Slides
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

// 7. Bookings (Admissions) - Admin only
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

// 8. Leaderboard
export function subscribeLeaderboard(callback: (list: LeaderboardEntry[]) => void) {
  const colRef = collection(db, 'leaderboard');
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const list: LeaderboardEntry[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as LeaderboardEntry));
        list.sort((a, b) => b.score - a.score);
        callback(list.slice(0, 5));
      } else {
        callback(INITIAL_LEADERBOARD.slice(0, 5));
      }
    },
    (err) => {
      console.warn('[Firestore] Leaderboard listener warning:', err.message);
      callback(INITIAL_LEADERBOARD.slice(0, 5));
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

// 9. Admin Batch Seed Utility (Only called intentionally by an authorized Admin)
export async function seedInitialDataToFirestore() {
  try {
    // Contact
    await setDoc(doc(db, 'settings', 'contact'), INITIAL_CONTACT_SETTINGS, { merge: true });
    // Social
    await setDoc(doc(db, 'settings', 'social'), INITIAL_SOCIAL_SETTINGS, { merge: true });
    // Admin list
    await setDoc(doc(db, 'settings', 'admins'), {
      emails: [DEFAULT_ADMIN_EMAIL, 'tayebkjl@gmail.com'],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    // Director
    await setDoc(doc(db, 'director', 'main'), INITIAL_DIRECTOR_PROFILE, { merge: true });
    // Teachers
    for (const t of INITIAL_TEACHERS) {
      await setDoc(doc(db, 'teachers', t.id), t, { merge: true });
    }
    // Slides
    for (const s of INITIAL_SLIDES) {
      await setDoc(doc(db, 'slides', s.id), s, { merge: true });
    }
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'batch/seed');
    throw err;
  }
}
