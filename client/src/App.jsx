import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "4f5f01cc7c0a5a1f7f75";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const param = urlParams.get("code");
    console.log(param);

    async function getToken() {
      try {
        await fetch("http://localhost:3000/getToken?code=" + param, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data) {
              localStorage.setItem("accessToken", data);
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
    if (param && localStorage.getItem("accessToken") === null) {
      getToken();
    }
  }, [rerender]);

  async function getUserRepos() {
    try {
        await fetch("http://localhost:3000/repos?user=" + userData.login, {
            method: "GET",
            headers: {
                Authorization: `${localStorage.getItem("accessToken")}`
            }
        }).then((res) => res.json()).then((data) => console.log(data))
    } catch(e) {
        console.error(e)
    }
  }

  async function getUserData() {
    try {
      await fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {console.log(data); setUserData(data)});
        await getUserRepos();
        setRerender(true);
    } catch (e) {
      console.error(e);
    }
  }

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <>
      {localStorage.getItem("accessToken") ? (
        <>
          <div>
            <img src={userData.avatar_url} width={90} height={90} alt="userImage" />
            <button onClick={getUserData}>Get User Data</button>
          </div>
        </>
      ) : (
        <div className="card">
          <button onClick={loginWithGithub}>Login with GitHub</button>
        </div>
      )}
    </>
  );
}

export default App;
