import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { UserProfileView } from '../components/UserProfileView';
import { subscribeContactSettings, subscribeSocialSettings } from '../lib/firestoreService';
import { INITIAL_CONTACT_SETTINGS, INITIAL_SOCIAL_SETTINGS } from '../lib/dataStore';
import { ContactSettings, SocialSettings } from '../lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [contactSettings, setContactSettings] = useState<ContactSettings>(INITIAL_CONTACT_SETTINGS);
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(INITIAL_SOCIAL_SETTINGS);

  useEffect(() => {
    const unsubContact = subscribeContactSettings(setContactSettings);
    const unsubSocial = subscribeSocialSettings(setSocialSettings);
    return () => {
      unsubContact();
      unsubSocial();
    };
  }, []);

  const navigate = (route: string) => {
    if (route.startsWith('#/')) {
      router.push(`/${route}`);
    } else {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-gray-900 selection:bg-[#2c5f2d] selection:text-[#ffd700]">
      <Head>
        <title>শিক্ষার্থী প্রোফাইল ও সনদপত্র | ইথাগোরাস প্রাইভেট</title>
        <meta
          name="description"
          content="ইথাগোরাস প্রাইভেটের শিক্ষার্থী প্রোফাইল হালনাগাদ, মেধা কুইজ ফলাফল ও অফিসিয়াল সনদপত্র প্রিন্ট এবং ডাউনলোড।"
        />
      </Head>

      <Navbar currentRoute="#/profile" navigate={navigate} contactSettings={contactSettings} />

      <main className="flex-1 py-8">
        <UserProfileView navigate={navigate} />
      </main>

      <Footer navigate={navigate} contactSettings={contactSettings} socialSettings={socialSettings} />
    </div>
  );
}
