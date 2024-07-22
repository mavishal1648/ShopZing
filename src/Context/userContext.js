import React, { useState, useContext, createContext, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import bcrypt from "bcryptjs-react";
import { toast } from "react-toastify";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userName") || null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setUser(null);
        localStorage.removeItem("userName");
      }
    });

    return () => unsubscribe();
  }, []);

  const checkEmailExists = async (email) => {
    try {
      const q = query(collection(db, "ShopZing"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        console.log("Document data:", docSnapshot.data());
        return docSnapshot;
      } else {
        console.log("No document found for email:", email);
        return null;
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error fetching documents. Please try again later.");
      return null;
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      const emailExists = await checkEmailExists(email);

      if (emailExists === null) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCred.user.uid;
        const hashPassword = bcrypt.hashSync(password, 10);

        await setDoc(doc(db, "ShopZing", userId), {
          name,
          email,
          password: hashPassword,
          cart: [],
          orders: [],
        });
        
        toast.success("User registered. Please login now.");
        return true;
      } else {
        toast.error("Email already present! Please login.");
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const emailExists = await checkEmailExists(email);

      if (!emailExists) {
        toast.error("Email not registered. Please sign up.");
        return false;
      }

      const storedPassword = emailExists.data().password;
      const checkPassword = bcrypt.compareSync(password, storedPassword);

      if (!checkPassword) {
        toast.error("Incorrect password.");
        return false;
      }

      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;
      setUserId(userId);
      const userName = emailExists.data().name;
      setUser(userName);
      localStorage.setItem("userName", userName);
      toast.success("User logged in successfully.");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userName");
      setUserId(null);
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <UserContext.Provider
      value={{ handleSignUp, handleSignIn, user, handleSignOut, userId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;