import { useState, useEffect, useCallback } from "react";
import VideoCard from "@components/VideoCard";
import styles from "@styles/Home.module.css";
import axios from "axios";
import { VStack, Spinner } from "@chakra-ui/react";
import Header from "@components/Header";
import MenuBar from "@components/Menu";
import { API_URL } from "pages";
import Navbar from "@components/Navbar";
import CreateEdition from "@components/CreateEdition";
import { useRouter } from "next/router";
import jeremy from "@data/jeremy.json";
import { useAccount, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import PlayzProfile from "@data/PlayzProfile.json";
import { useAuth } from "@components/AuthProvider";

function Feed() {
  const router = useRouter();
  const { fetchedUser, fetchedUser1, fetchUser1 } = useAuth();
  const { data: signer, isError } = useSigner();
  const { id } = router.query;
  const [fetchedVideo, setFetchedVideo] = useState(null);
  const { address } = useAccount();
  const [videos, setvideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mediaURL, setMediaURL] = useState(null);

  const [videosLoaded, setVideosLoaded] = useState(false);

  const getVideos = useCallback(async () => {
    try {
      if (id && id === "2") {
        setvideos([
          {
            comments: {},
            likes: {},
            video_files: [
              {
                link: "/newVideo.mp4",
              },
            ],
          },
          ...jeremy,
        ]);
        setVideosLoaded(true);
      } else {
        const response = await axios.get(`${API_URL}/videos/${address}`);
        console.log("response. data: ", response);
        setvideos((oldVideos) => [...oldVideos, ...response.data]);
        setVideosLoaded(true);
      }
    } catch (e) {
      console.error(e);
      setVideosLoaded(false);
    }
  }, [address, id]);

  const getCreators = async () => {
    try {
      const response = await axios.get(`${API_URL}/creators`);
      setCreators((oldVideos) => [...oldVideos, ...response.data]);
    } catch (e) {
      console.error(e);
    }
  };

  const getVideo = useCallback(async () => {
    if (!fetchedUser1) return;

    const contract = new ethers.Contract(
      fetchedUser1.profileAddress,
      PlayzProfile.abi,
      signer
    );
    const uri = await contract["uri(uint256)"](BigNumber.from(1));
    const response = await axios.get(uri);
    setFetchedVideo(response.data);
  }, [fetchedUser1, signer]);

  useEffect(() => {
    getVideo();
    getVideos();
    getCreators();
    if (!fetchedUser1) fetchUser1();
  }, [fetchUser1, fetchedUser1, getVideo, getVideos, id]);

  if (uploadedFile)
    return (
      <main className={styles.main}>
        <Navbar title="" isPost setUploadedFile={setUploadedFile} />
        <CreateEdition
          uploadedFile={uploadedFile}
          mediaURL={mediaURL}
          setUploadedFile={setUploadedFile}
        />
      </main>
    );

  return (
    <main className={styles.main}>
      <Header isFeed />
      <div className={styles.sliderContainer}>
        {fetchedVideo ? (
          [fetchedVideo, fetchedVideo].map((v, id) => (
            <VideoCard
              key={id}
              index={id}
              video={v}
              lastVideoIndex={1}
              getVideos={getVideos}
              creator={{
                name: { first: "Playzboy", last: "" },
                location: { city: "Unknown" },
                picture: { thumbnail: "/playzboy.png" },
              }}
            />
          ))
        ) : videos.length > 0 ? (
          <>
            {videos.slice(0, 10).map((video, id) => (
              <VideoCard
                key={id}
                index={id}
                video={video}
                lastVideoIndex={videos.length - 1}
                getVideos={getVideos}
                creator={{
                  name: { first: "Jeremy", last: "Starr" },
                  location: { city: "North Hollywood" },
                  picture: { thumbnail: "/jeremy.jpg" },
                }}
              />
            ))}
          </>
        ) : (
          <VStack h="100vh" justifyContent="center">
            <Spinner />
          </VStack>
        )}
      </div>
      <MenuBar setUploadedFile={setUploadedFile} setMediaURL={setMediaURL} />
    </main>
  );
}

export default Feed;
