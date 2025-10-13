import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css"
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function ProfilePage(){

    const authState = useSelector((state)=>state.auth)
    const postReducer = useSelector((state)=>state.postReducer)

    const [userProfile,setUserProfile] = useState({})

    const [userPosts , setUserPosts] = useState([])

    const dispatch = useDispatch();


    const [isModalOpen , setIsModalOpen] = useState(false);

    const[isEducationModalOpen,setIsEducationModalOpen] = useState(false);

    const [inputData , setInputData] = useState({company:'',position:'',years:''});
      
    const [educationInputData , setEducationInputData] = useState({school:'',degree:'',fieldofStudy:''});

    const handleWorkInputChange = (e)=>{
       
      const {name, value} = e.target;
      setInputData({...inputData,[name]:value})
    }

     const handleEducationInputChange = (e)=>{
       
      const {name, value} = e.target;
      setEducationInputData({...educationInputData,[name]:value})
    }


    useEffect(()=>{
        dispatch(getAboutUser({token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    },[])


    useEffect(()=>{
     
     if (authState.user != undefined) {
        setUserProfile(authState.user)
            let post = postReducer.posts.filter((post) => {
            post.userId.username === authState.user.userId.username;
          })
          setUserPosts(post);
        }
    },[authState.user,postReducer.posts])


    const updateProfilePicture = async (file)=>{
         const formData = new FormData();
         formData.append("profile_picture", file);
         formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture",formData,{
            header:{
                'Content-Type':'multipart/form-data',
            },
        });

        dispatch(getAboutUser({token:localStorage.getItem('token')}));
    }


    const updateProfileData = async()=>{
      const request = await clientServer.post("/user_update",{
        token: localStorage.getItem("token"),
        name: userProfile.userId.name, 
      });

      const response = await clientServer.post("/update_profile_data",{
        token:localStorage.getItem("token"),
        bio: userProfile.bio,
        pastWork: userProfile.pastWork,
        education: userProfile.education
      });

      dispatch(getAboutUser({token: localStorage.getItem("token")}))

    }
    

    return(
       <UserLayout>
        <DashboardLayout>
         {authState.user && userProfile.userId &&  
        <div className={styles.container}>
          {/* Backdrop */}
          <div className={styles.backDropContainer}>
            <div  className={styles.backDrop}>
             <label htmlFor="profilePictureUpload"className={styles.backDrop_overlay}>
                <p>
                    Edit
               </p>

                </label>  
                <input onChange={(e)=>{
                    updateProfilePicture(e.target.files[0])
                }}
                hidden type="file" id="profilePictureUpload"/>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="backDrop"
            />
            </div>
          </div>

          {/* Profile details */}
          <div className={styles.profileContainer_details}>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <div style={{ flex: 0.8 }}>
                <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: '0.5rem' }}>
                 <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                     setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
                 }}/>
                  <p style={{ color: 'grey' }}>@{userProfile.userId.username}</p>
                </div>

                

                {/* Bio */}
               <div>
                 <textarea
                value={userProfile.bio || ""}
                onChange={(e) => {
                setUserProfile({ ...userProfile, bio: e.target.value });
                }}
               rows={Math.max(3, Math.ceil((userProfile.bio?.length || 0) / 80))}
               style={{ width: "100%" }}
                />
            </div>

                {/* Recent Activity */}
                <div style={{ flex: 0.2 }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map(post => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          ) : (
                            <div style={{ width: '3.4rem', height: '3.4rem' }} />
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



     <div className="educationHistory">
  <h4>Education</h4>
  <div className={styles.educationHistoryContainer}>
    {userProfile.education?.map((edu, index) => (
      <div key={index} className={styles.educationHistoryCard}>
        <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {edu.institution} - {edu.degree}
        </p>
        <p>{edu.year}</p>
      </div>
    ))}
    <button
      className={styles.addWordButton}
      onClick={() => setIsEducationModalOpen(true)}
    >
      Add Education
    </button>
  </div>
</div>
{isEducationModalOpen && (
  <div
    onClick={() => {
      setIsEducationModalOpen(false);
    }}
    className={styles.commentsContainer}
  >
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={styles.allCommentsContainer}
    >
      <input
        onChange={handleEducationInputChange}
        name="institution"
        className={styles.inputField}
        type="text"
        placeholder="Enter Institution"
      />
      <input
        onChange={handleEducationInputChange}
        name="degree"
        className={styles.inputField}
        type="text"
        placeholder="Enter Degree"
      />
      <input
        onChange={handleEducationInputChange}
        name="year"
        className={styles.inputField}
        type="number"
        placeholder="Year"
      />
      <div
        onClick={() => {
          setUserProfile({
            ...userProfile,
            education: [...(userProfile.education || []), educationInputData],
          });
          setIsEducationModalOpen(false);
        }}
        className={styles.connectionButton}
      >
        Add Education
      </div>
    </div>
  </div>
)}
     

          {/* Work History */}
          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.wrokHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
              return (
                <div key={index} className={styles.wrokHistoryCard}>
                  <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
  )})}
            <button className={styles.addWordButton} onClick={()=>{
              setIsModalOpen(true)
            }}>Add Work</button>
            </div>
          </div>
          {userProfile != authState.user &&
        <div onClick={()=>{
           updateProfileData();
        }}className={styles.connectionButton}>
          Update Profile 
          </div>
         }
          
         </div>
         }

          {
        isModalOpen &&
      <div 
      onClick={()=>{
        dispatch(resetPostId());
      }}
      className={styles.commentsContainer}>
        <div 
        onClick={(e)=>{
          e.stopPropagation()
        }}
        className={styles.allCommentsContainer}>
    <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder="Enter Company" />
    <input onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder="Enter Position" />
    <input onChange={handleWorkInputChange} name='years'className={styles.inputField} type="number" placeholder="Years" />
      <div onClick={()=>{
        setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
        setIsModalOpen(false)
      }}
      className={styles.connectionButton}>Add Work</div>    
            </div>
            </div>
}




        </DashboardLayout>
       </UserLayout>
    )
}