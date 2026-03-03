# Ayurveda Mobile

## 1. Project Overview

> Application Name:
> Ayurveda Mobile  v.1.0.0

**Application Category / Topic:**
> Health & Wellness / Fitness

**Main purpose:**

Ayurveda Mobile is a personalized wellness application based on Ayurvedic principles. The app helps users discover their dominant dosha (Vata, Pitta, or Kapha) through an interactive test and provides tailored recommendations for therapies, herbal medicines, and wellness programs. It aims to simplify traditional Ayurvedic knowledge into a modern, dynamic mobile experience with personalized content and guidance.

In addition, the application allows users to book appointments for consultations, therapies, and personalized Ayurvedic programs directly through the platform, making access to professional Ayurvedic care easy and convenient.

---

## 2. User Access & Permissions


> #### Guest (Not Authenticated)

*An unauthenticated user can access:*

- Login screen

- Registration screen

*Basic authentication forms guests cannot access:*

- Home screen

- Therapies

- Programs

- Appointments


> #### Authenticated User

*A logged-in user can access:*

**Main sections / tabs:**

- Home

- Therapies

- Appointments

- Programs

- Profile

- Details screens:

- Therapy details

- Appointment details

- Program details

**Create / Edit / Delete actions:**

- Update profile information

- Complete dosha test

- Save onboarding data


*(Future extension: Save favorite therapies/programs)*

---

## 3. Authentication & Session Handling
>Authentication Flow

When the app starts, onAuthStateChanged from Firebase Auth is triggered.

The app checks whether a Firebase user session exists.

### If authenticated:

The app fetches user data from Firestore.

It checks the hasCompletedOnBoarding flag.

Navigation is decided based on:

Not authenticated → AuthNavigator

Authenticated but onboarding incomplete → OnBoardingNavigator

Authenticated and onboarding complete → RootNavigator (Main App)

### On logout:

Firebase session is cleared.

Auth state is reset.

User is redirected to AuthNavigator.

Session Persistence

The session is managed by Firebase Authentication.

Firebase automatically persists the user session securely.

When the app restarts, Firebase restores the session automatically.

onAuthStateChanged ensures automatic login without re-entering credentials.

---
## 4. Navigation Structure
>Root Navigation Logic

**Navigation is split into two main states:**

- Not authenticated → AuthNavigator

Authenticated but onboarding incomplete → OnBoardingNavigator

- Authenticated → RootNavigator

This logic is handled inside AppNavigator.

> Main Navigation

### The main application uses:

**Bottom Tab Navigation**

*Main tabs:*

- Home

- Therapies

- Appointments

- Programs

- Profile

> Nested Navigation

**Yes** — nested navigation is implemented.

*Each tab contains its own Stack Navigator.*

Example:

HomeStack → HomeScreen → DetailsScreen

TherapiesStack → TherapiesList → TherapyDetails

HerbalStack → HerbalList → HerbalDetails

ProgramsStack → ProgramsList → ProgramDetails

--- 

### 5. List → Details Flow
> List / Overview Screen

**Displays:**

- Therapies

- Appointments

- Programs

*Data is fetched from Firestore collections.*

**User interaction:**

- Scroll through list

- Tap on an item to open its details

- Details Screen

- Booking screen

**Navigation is triggered via:**

> navigation.navigate("DetailsScreen", { item })

**Route parameters include:**

- Item ID

- Title

- Description

- Dosha information

**Images**

Additional metadata

---

### 6. Data Source & Backend

Backend Type:
Firebase (Real Backend)

**Services used:**

* Firebase Authentication

* Cloud Firestore

* Firebase Storage (for images)

---

### 7. Data Operations (CRUD)


  #### Read (GET)

- Fetching therapies


- Fetching programs


- Fetching user profile data

- Data is retrieved from Firestore collections using getDocs().

#### Create (POST)

- User registration

- Creating user Firestore document

- Saving dosha test results

- Completing onboarding

- Update / Delete (Mutation)

- Add Allergies

**Update:**

- Update appointments


#### UI update:

* React state updates

* AuthContext state update

* Navigation re-render based on state change

*(Delete functionality can be extended later for saved items or bookings)*

---

## 8. Forms & Validation

* Login Form

* Registration Form

* Dosha Test Form

* Profile Update Form

* Validation Rules

---

## 9. Native Device Features


* Image Picker (Camera / Gallery)


*Used in user registration*


>Functionality: Allows the user to select or capture a profile image. Image URL can be stored in Firestore and displayed in the profile.

---

 ## 10. Typical User Flow

* User installs and opens the app.

* Registers or logs in.

* Completes onboarding.

* Takes Dosha test.

* Views personalized result.

* Enters main application.

* Browses therapies, herbal medicines, and programs.

* Receives animated content based on dominant dosha.
---

## 11. Error & Edge Case Handling

**Authentication Errors**

* Invalid email/password

* Registration failures

**Network or Data Errors**

* Try/catch blocks for Firestore requests

* Console error logging

* Loading indicators during async operations

* Empty or Missing Data States

* Loading spinners while fetching data

* Fallback default values

* Graceful UI when no items exist

### Future Improvements

* Favorites system

* Booking system

* Push notifications

* Real-time Firestore listeners

* Advanced personalization logic

* Dual dosha calculation support

* Admin content management panel

### Walk Through

> Install Project
> `npm i`

> Start Expo Go
> `npm start`

_Enjoy_
