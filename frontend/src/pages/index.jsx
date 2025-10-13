import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import React from "react";
const inter = Inter({ subsets: ["latin"] });
import UserLayout from "../layout/UserLayout";



export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
     <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>Connect with friend without Exaggreation</p>
          <p>A True social media platform, with stories no blufs.!</p>
          <div onClick={() =>{
             router.push("/login");
          }} className={styles.buttonJoin}>
            <p>Join Now</p>
          </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img src="images\pngtree-business-people-communication-concept-png-image_5011317.png" alt="Login Hero Image" />
        </div>
      </div>
     </div>
    </UserLayout>
    );
}
