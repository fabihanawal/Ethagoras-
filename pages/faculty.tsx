import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar';
import { FacultySection } from '../components/FacultySection';
import { Footer } from '../components/Footer';
import {
  subscribeContactSettings,
  subscribeSocialSettings,
  subscribeDirector,
  subscribeTeachers,
} from '../lib/firestoreService';
import {
  INITIAL_CONTACT_SETTINGS,
  INITIAL_SOCIAL_SETTINGS,
  INITIAL_DIRECTOR_PROFILE,
  INITIAL_TEACHERS,
} from '../lib/dataStore';
import { ContactSettings, SocialSettings, DirectorProfile, TeacherProfile } from '../lib/types';

export default function FacultyPage() {
  const router = useRouter();
  const [contactSettings, setContactSettings] = useState<ContactSettings>(INITIAL_CONTACT_SETTINGS);
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(INITIAL_SOCIAL_SETTINGS);
  const [director, setDirector] = useState<DirectorProfile>(INITIAL_DIRECTOR_PROFILE);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);

  useEffect(() => {
    const unsubContact = subscribeContactSettings(setContactSettings);
    const unsubSocial = subscribeSocialSettings(setSocialSettings);
    const unsubDirector = subscribeDirector(setDirector);
    const unsubTeachers = subscribeTeachers(setTeachers);

    return () => {
      unsubContact();
      unsubSocial();
      unsubDirector();
      unsubTeachers();
    };
  }, []);

  const navigate = (route: string) => {
    window.location.href = `/${route}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-gray-900 selection:bg-[#2c5f2d] selection:text-[#ffd700]">
      <Head>
        <title>শিক্ষক ও পরিচালক প্রোফাইল | ইথাগোরাস প্রাইভেট নওগাঁ</title>
        <meta
          name="description"
          content="ইথাগোরাস প্রাইভেটের প্রতিষ্ঠাতা ও পরিচালক এবং অভিজ্ঞ শিক্ষকমণ্ডলীর পরিচিতি ও বার্তা।"
        />
      </Head>

      <Navbar currentRoute="#/faculty" navigate={navigate} contactSettings={contactSettings} />

      <main className="flex-1">
        <FacultySection director={director} teachers={teachers} navigate={navigate} />
      </main>

      <Footer navigate={navigate} contactSettings={contactSettings} socialSettings={socialSettings} />
    </div>
  );
}
