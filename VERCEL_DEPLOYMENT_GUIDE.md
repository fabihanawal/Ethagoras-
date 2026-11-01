# ইথাগোরাস প্রাইভেট — গিটহাব ও ভারসেল (Vercel) ডিপ্লয়মেন্ট গাইড

এই প্রজেক্টটি Next.js এবং Firebase সমৃদ্ধ একটি সম্পূর্ণ রেডি-টু-ডিপ্লয় অ্যাপ্লিকেশন। গিটহাব রিপোজিটরির মাধ্যমে ভারসেলে লাইভ করার জন্য নিচের সহজ ধাপগুলো অনুসরণ করুন।

---

## ধাপ ১: গিটহাবে কোড পুশ (GitHub Push)

আপনার লোকাল মেশিনের টার্মিনালে এই কমান্ডগুলো রান করুন:

```bash
# সব পরিবর্তন স্টেজিং এ যুক্ত করুন
git add .

# কমিট মেসেজ দিন
git commit -m "Configure Firebase Auth, Firestore Admin Panel, and Vercel setup"

# মেইন ব্রাঞ্চে পুশ করুন
git push origin main
```

*(যদি আপনার প্রধান ব্রাঞ্চের নাম `master` হয়, তবে `git push origin master` ব্যবহার করুন)*

---

## ধাপ ২: ভারসেলে (Vercel) প্রজেক্ট ইমপোর্ট ও ডিপ্লয়

1. [vercel.com](https://vercel.com)-এ যান এবং আপনার GitHub একাউন্ট দিয়ে লগইন করুন।
2. ড্যাশবোর্ড থেকে **"Add New..."** বাটনে ক্লিক করে **"Project"** নির্বাচন করুন।
3. আপনার গিটহাব রিপোজিটরি (`fabihanawal/Ethagoras-`) এর পাশে **"Import"** বাটনে ক্লিক করুন।
4. **Configure Project** স্ক্রিনে:
   - **Framework Preset**: `Next.js` (স্বয়ংক্রিয়ভাবে ডিটেক্ট হবে)
   - **Root Directory**: `./` (ডিফল্ট থাকবে)
   - **Build Command**: `next build` (ডিফল্ট)
   - **Output Directory**: `.next` (ডিফল্ট)
5. **Environment Variables** (পরিবেশ পরিবর্তনশীল মানসমূহ):
   - প্রজেক্টে ইতিমধ্যে `firebase-applet-config.json` যুক্ত থাকায় এটি সরাসরি বিল্ড হবে।
   - অতিরিক্ত নিরাপত্তার জন্য Vercel Dashboard -> Environment Variables-এ নিচের ভ্যারিয়েবলগুলো কপি করে দিতে পারেন:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=decent-edge-9cf5x
NEXT_PUBLIC_FIREBASE_APP_ID=1:129131933096:web:a8709dac39f23abdd9019d
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCIzlnE_bTRnclXfBIjQHh1cMV9TugLP_s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=decent-edge-9cf5x.firebaseapp.com
NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID=ai-studio-ethagoras-5d91e1b0-61f4-447f-a914-e936de6de317
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=decent-edge-9cf5x.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=129131933096
```

6. **"Deploy"** বাটনে ক্লিক করুন। ২ মিনিটের মধ্যে প্রজেক্টটি সফলভাবে লাইভ হয়ে যাবে!

---

## ধাপ ৩: ফায়ারবেস অথেন্টিকেশন ডোমেইন অনুমোদন (গুরুত্বপূর্ণ)

ভারসেলে ডিপ্লয় সম্পন্ন হলে আপনি একটি লাইভ লিংক পাবেন (যেমন: `your-app.vercel.app`)। গুগল জিমেইল দিয়ে সাইন-ইন যাতে এই লাইভ ডোমেইনে কাজ করে, তার জন্য:

1. [Firebase Console](https://console.firebase.google.com/)-এ যান।
2. আপনার প্রজেক্ট **`decent-edge-9cf5x`** সিলেক্ট করুন।
3. বাম পাশের মেনু থেকে **Build > Authentication**-এ যান।
4. ওপরের ট্যাবে **Settings**-এ ক্লিক করে **Authorized domains** সেকশনে যান।
5. **"Add domain"** বাটনে ক্লিক করে আপনার Vercel ডোমেইনটি (যেমন: `your-app.vercel.app` বা কাস্টম ডোমেইন) পেস্ট করে **Add** করুন।

---

## 🎯 ফলাফল:
- আপনার অ্যাপ্লিকেশনটি সার্বক্ষণিক বিশ্বমানের Vercel CDN সার্ভারে চলবে।
- আপনি গিটহাবে কোনো নতুন কোড `git push` করলেই Vercel স্বয়ংক্রিয়ভাবে নতুন ভার্সন বিল্ড ও ডিপ্লয় করে নিবে।
- এডমিন জিমেইল (`kajalvai0@gmail.com`) দিয়ে সরাসরি লাইভ সাইটের এডমিন প্যানেল পরিচালনা করা যাবে।
