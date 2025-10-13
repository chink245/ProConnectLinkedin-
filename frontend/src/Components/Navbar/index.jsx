import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';
import { useSelector,useDispatch } from 'react-redux';
import { reset } from "@/config/redux/reducer/authReducer";


export function NavBarComponenet() {
  const router = useRouter();  
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);
  return (
    <div className={styles.container}>
    <nav className={styles.navbar}>
        <h1 style={{cursor:"pointer"}}onClick={()=>{
              router.push("/")
        }}>Pro Connect</h1>
    <div className={styles.navBarOptionContainer}>
       
      {authState.profileFetched && <div>
        <div style={{display:"flex",gap:"1.2 rem"}}>
        {/* <p>Hey, {authState.user.userId.name}</p>&nbsp; */}
        <p onClick={()=>{
          router.push("/profile")
        }}
        style={{fontWeight:"bold",cursor:"pointer"}}>Profile</p>&nbsp;
        <p onClick={()=>{
          localStorage.removeItem("token");
          router.push("/login");
        }}style={{fontWeight:"bold",cursor:"pointer"}}>LogOut</p>
        </div>
        </div>} 

      {!authState.profileFetched && <div onClick={() =>{
           router.push("/login")
           dispatch(reset())
        }}className={styles.buttonJoin}>
            <p>Be a part</p>
        </div>}
        
    </div>
    </nav>
    </div>
  )
}


