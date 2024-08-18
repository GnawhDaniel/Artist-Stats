"use client";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { User } from "@/components/interfaces";
import { useEffect, useState } from "react";
import { getUser } from "@/functions/api";
import { loadingElement } from "@/components/loading";

export default function Help() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  // Call get all artists on page load
  useEffect(() => {
    async function init() {
      const user = await getUser();
      setUser(user);

      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center">
      <div className="flex max-w-[90%] w-full">
        <div>
          <Sidebar
            username={user?.username ?? ""}
            currentPath={usePathname() ?? ""}
          />
        </div>
        {loading ? (
          loadingElement
        ) : (
          <div className="p-4 w-full h-full max-h-screen">
            <h1 className="font-extrabold text-5xl italic">FAQ</h1>
            <hr className="border-t-2 border-white my-2" />
            <ul className="flex flex-col gap-5 max-h-[93%] bg-gray-700 p-4 rounded-3xl overflow-auto">
              <li>
                <h2 className="font-bold">What is the purpose of this site?</h2>
                <p className="ml-6 font-light">
                  I started developing this site because of my passion for
                  discovering small and up-and-coming artists. It’s also a bit
                  of a way to show off to my friends—providing proof that I knew
                  about certain artists before they became well-known! So if
                  you're like me and you enjoy seeing how an artist’s popularity
                  grows, I hope you'll find this website useful. This site is
                  designed to track artists' follower counts over time.
                  Currently, the stats are pulled from Spotify's public API.
                  Depending on interest, I may add more statistics from YouTube
                  and other social media platforms in the future.
                </p>
              </li>
              <li>
                <h2 className="font-bold">What am I meant to do here?</h2>
                <p className="ml-6 font-light">
                  To get started, navigate to the "Dashboard" section in the
                  sidebar. From there, you can add any artists you wish to track
                  and monitor their follower growth over time. After adding an
                  artist, go to "Graph" to view their follower count. If you are
                  the first person to add an artist to your list across all
                  musipster accounts, there will initially be only one data point. More
                  data points will be added daily at 12:00 AM UTC. You may
                  notice that the second data point is the same as the first;
                  this is due to the design of the backend/database. However,
                  after the first two days, the chart should accurately reflect
                  artist growth with different values (unless they do not gain
                  or lose followers).
                </p>
              </li>
              {/* <li>
                <h2 className="font-bold">
                  When are the WIP sections going to be finished?
                </h2>
                <p className="ml-6 font-light">
                  I’m not sure yet, but I hope to complete them soon. The
                  "Dashboard" and "My Artists" sections were the primary focus
                  when starting this project.
                </p>
              </li> */}
              <li>
                <h2 className="font-bold">
                  Are there any plans to sync my musipster profile with Spotify?
                </h2>
                <p className="ml-6 font-light">
                  I've been thinking about whether or not to accomodate for
                  this. If I were to add a way to sync your Spotify profile to
                  your account, I would most likely need to also do the same for
                  other platforms likely YouTube, Soundcloud, Apple Music, etc.
                  As of now, I do not have any plans to accomodate for this just
                  yet, but likely in the future.
                </p>
              </li>
              <li>
                <h2 className="font-bold">
                  What?! None of the 3 answers above answered your question?
                </h2>
                <p className="ml-6 font-light">
                  Shoot me an email at "danielhwangdeveloper@gmail.com". I'll do
                  my best to respond, though I can't guarantee a quick reply.
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
