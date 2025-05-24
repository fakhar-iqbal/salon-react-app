import React, { useEffect } from "react";
import "../styles/dashboard.css";
import { db } from "../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import TopUsersChart from "../components/dashboard/MostSubscribedUsersChart";
import UsersAgeChart from "../components/dashboard/UsersAgeChart";
import WaveIcon from "../assets/waveIcon.svg";
import UsersTbody from "../components/users/UsersTbody";
import MostUserPostsTbody from "../components/dashboard/MostUserPostsTbody";

export default function Dashboard() {
  const [totalChatRooms, settotalChatRooms] = useState(0);
  const [totalUsers, settotalUsers] = useState(0);
  const [ageVariations, setageVariations] = useState({});
  const [mostSubscribedUsers, setmostSubscribedUsers] = useState([]);
  const [mostUserPosts, setmostUserPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [totalPosts, settotalPosts] = useState(0);

  const calculateAgeGroup = (birthdate) => {
    const age = moment().diff(birthdate, "years") + 1;
    if (age >= 0 && age <= 18) return "10-18";
    if (age >= 19 && age <= 30) return "19-30";
    if (age >= 31 && age <= 45) return "31-45";
    if (age >= 46 && age <= 57) return "46-57";
    else return "58+";
  };

  const getAllUsers = async () => {
    const ageDistribution = {
      "10-18": 0,
      "19-30": 0,
      "31-45": 0,
      "46-57": 0,
      "58+": 0,
    };
    const usersCollectionRef = collection(db, "users");
    getDocs(usersCollectionRef).then((querySnapshot) => {
      settotalUsers(querySnapshot.docs.length);
      const usersArray = [];

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        usersArray.push(user);

        const birthdate = user.dateOfBirth.replace("/", "-");
        const birthdateToDate = moment(birthdate, "DD-MM-YYYY");
        const ageGroup = calculateAgeGroup(birthdateToDate);

        ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
      });

      setageVariations({ ...ageDistribution });

      usersArray.sort((a, b) => b.subscribers.length - a.subscribers.length);
      setmostSubscribedUsers(usersArray.slice(0, 7));

      usersArray.sort((a, b) => b.posts.length - a.posts.length);
      setmostUserPosts(usersArray.slice(0, 5));
    });
  };

  const getTotallPosts = async () => {
    let { count } = (
      await getCountFromServer(query(collection(db, "posts")))
    ).data();
    settotalPosts(count);
  };

  const getTotallChatRooms = async () => {
    let { count } = (
      await getCountFromServer(query(collection(db, "chatrooms")))
    ).data();
    settotalChatRooms(count);
  };

  const getData = () => {
    setloading(true);
    Promise.all([getAllUsers(), getTotallPosts(), getTotallChatRooms()])
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="main-heading underline">Dashboard</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-top">
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Users</h4>
                <h2>{totalUsers} Users</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Posts</h4>
                <h2>{totalPosts} Posts</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Chatrooms</h4>
                <h2>{totalChatRooms} Chatrooms</h2>
              </div>
              <img src={WaveIcon} />
            </div>
          </div>
          <div>
            <div className="dashboard-chart-wrapper">
              <div className="top-users-wrapper">
                <h2 className="main-heading center">Most Posts By Users</h2>
                <div className="top-users-chart-wrapper">
                  <TopUsersChart
                    screenWidth={screenWidth}
                    usersData={mostSubscribedUsers}
                    // subsCount={mostSubscribedUsers.map(
                    //   (user) => user.subscribers.length + 1
                    // )}
                    // userLabels={mostSubscribedUsers.map((user) => user.username)}
                  />
                </div>
              </div>

              <div className="users-age-wrapper">
                <h2 className="main-heading center">Users Age Variations</h2>
                <div className="users-age-chart-wrapper">
                  <UsersAgeChart
                    screenWidth={screenWidth}
                    usersData={ageVariations}
                    totalUsers={totalUsers}
                    // ageData={Object.keys(ageVariations).map(
                    //   (key) => ageVariations[key]
                    // )}
                    // ageLabels={Object.keys(ageVariations).map((key) => key)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-table-wrapper">
            <h2 className="main-heading">Most Posts By Users</h2>
            <div className="table w-full">
              <table style={{ height: "auto" }}>
                <tr
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "0.5px solid rgba(124, 124, 124, 0.27)",
                  }}
                >
                  <th></th>
                  <th>UserName</th>
                  <th>Email</th>
                  <th>No. of Posts</th>
                  <th>No. of Subscribers</th>
                  <th>Actions</th>
                </tr>
                {mostUserPosts.map((val, ind) => (
                  <MostUserPostsTbody
                    key={ind}
                    username={val.username}
                    profilePic={val.image}
                    noOfPosts={val.posts.length}
                    noOfSubscribers={val.subscribers.length}
                    email={val.email}
                    id={val.uid}
                  />
                ))}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
