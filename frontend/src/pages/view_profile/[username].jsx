
import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionsRequest } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { BASE_URL, clientServer } from '@/config';
import styles from './index.module.css';

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(false);

  // Fetch posts and connections

  // Filter posts for this user
  // useEffect(() => {
  //   if (postReducer.posts) {
  //     const posts = postReducer.posts.filter(post => post.userId.username === router.query.username);
  //     setUserPosts(posts);
  //   }
  // }, [postReducer.posts]);

    const getUsersPost= async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  };

  // Check connection status
 useEffect(() => {
   getUsersPost();
  }, []);



 useEffect(() => {
       let posts = postReducer.posts.filter(
        (post) => {
          return post.userId.username === router.query.username
 });
      setUserPosts(posts);
    }, [postReducer.posts]);

  // useEffect(() => {
  //   if (!Array.isArray(authState.connections) || !userProfile?.userId?._id) return;

  //   const userId = userProfile.userId._id;

  //   // Check if connection is accepted
  //   const acceptedConnection = authState.connections.find(
  //     (c) => c.connectionId === userId && c.status_accepted === true
  //   );

  //   // Check if there is a pending request
  //   const pendingRequest = authState.connectionRequest.find(
  //     (r) => r.userId._id === userId && r.status_accepted !== true
  //   );

  //   // Check if current user received a request from this profile (for accept button)
  //   const receivedRequest = authState.connectionRequest.find(
  //     (r) => r.connectionId === authState.user._id && r.userId._id === userId && r.status_accepted !== true
  //   );

  //   if (acceptedConnection) {
  //     setCurrentUserInConnection(true);
  //     setIsConnectionNull(false); // Show "Connected"
  //   } else if (pendingRequest) {
  //     setCurrentUserInConnection(true);
  //     setIsConnectionNull(true); // Show "Pending"
  //   } else if (receivedRequest) {
  //     setCurrentUserInConnection(false);
  //     setIsConnectionNull(false); // Show "Accept"
  //   } else {
  //     setCurrentUserInConnection(false);
  //     setIsConnectionNull(true); // Show "Connect"
  //   }
  // }, [authState.connections, authState.connectionRequest, userProfile, authState.user]);

  // Handle connection request click



  useEffect(()=>{
    console.log(authState.connections , userProfile.userId._id)
      if(authState?.connections?.some(user => user.connectionId._id === userProfile.userId._id)){
        setCurrentUserInConnection(true);

        if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
          setIsConnectionNull(false)
        }

      }

       if(authState?.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
        setCurrentUserInConnection(true);

        if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
          setIsConnectionNull(false)
        }

      }

    
    
  },[authState.connections,authState.connectionRequest])


  const handleConnectClick = async () => {
    await dispatch(
    sendConnectionsRequest({
      token: localStorage.getItem('token'),
      connectionId: userProfile.userId._id
    })
  );

  // 🔥 Immediately mark as pending
  setCurrentUserInConnection(true);
  setIsConnectionNull(true);

  // Also refresh from server
  await getUsersPost();
};

  // Handle resume download
  const handleDownloadResume = async () => {
    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
    window.open(`${BASE_URL}/${response.data.message}`, '_blank');
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          {/* Backdrop */}
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="backDrop"
            />
          </div>

          {/* Profile details */}
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: '0.5rem' }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: 'grey' }}>@{userProfile.userId.username}</p>
                </div>

                {/* Connection & Resume Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: '1rem 0' }}>
                  {isCurrentUserInConnection ? 
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? 'Pending' : 'Connected'}
                    </button>
                   : 
                    <button onClick={handleConnectClick} className={styles.connecteBtn}>
                      Connect
                    </button>
                  }

                  <div onClick={handleDownloadResume} style={{ cursor: 'pointer' }}>
                    <svg
                      style={{ width: '1.2rem' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p>{userProfile.bio}</p>
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

          {/* Work History */}
          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.wrokHistoryContainer}>
              {userProfile.pastWork.map((work, index) => (
                <div key={index} className={styles.wrokHistoryCard}>
                  <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

// Fetch user profile from server
export async function getServerSideProps(context) {
  const { username } = context.query;

  try {
    const request = await clientServer.get('/user/get_profile_based_on_username', {
      params: { username }
    });

    return { props: { userProfile: request.data.profile } };
  } catch (err) {
    console.error('Error fetching profile:', err);
    return { props: { userProfile: null } };
  }
}








