import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-16 justify-center p-10 lg:px-0">
      <div className="flex flex-col z-10 w-full max-w-5xl">
        <h1 className="flex text-6xl">
          <strong>musipster</strong>
          <a href="/login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-14 ml-3 transition-all hover:scale-125 hover:transition-all hover:filter text-blue-600 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </a>
        </h1>
        <h2 className="text-3xl">[/mjuːˈzɪp.stər/]</h2>
        <h2 className="text-3xl">
          noun,{" "}
          <i className="text-2xl">
            Plural <b>mu·sip·sters</b>
          </i>
        </h2>

        <div className="mt-5 flex items-center">
          <h1 className="flex text-2xl mr-3 self-start relative">
            1
            <span className="absolute left-1/2 top-full h-full w-[2px] bg-gray-400 transform -translate-x-1/2"></span>
          </h1>
          <div>
            <p className="text-2xl">
              a person who likes to find obscure, up-and-coming music artists
            </p>
            <p className="text-xl">
              <i>
                "My friend, Daniel, is a snobby musipster who even built a
                website for it."
              </i>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center">
          <h1 className="flex text-2xl mr-3 self-start relative">
            2
            <span className="absolute left-1/2 top-full h-full w-[2px] bg-gray-400 transform -translate-x-1/2"></span>
          </h1>
          <div>
            <p className="text-2xl">
              an individual who is passionate about supporting independent
              artists and alternative music scenes
            </p>
            <p className="text-xl">
              <i>
                "She is a true musipster, always attending local gigs and
                festivals, cheering on emerging bands."
              </i>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center">
          <h1 className="flex text-2xl mr-3 self-start relative">
            3
            <span className="absolute left-1/2 top-full h-full w-[2px] bg-gray-400 transform -translate-x-1/2"></span>
          </h1>
          <div>
            <p className="text-2xl">
              a self-proclaimed tastemaker in the world of music, who enjoys
              being ahead of the curve.
            </p>
            <p className="text-xl">
              <i>
                "His musipster tendencies are evident from his vast collection
                of vinyl records and his disdain for anything on the top
                charts."
              </i>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <h1 className="text-4xl">Word History</h1>
        <hr className="border-gray-400 my-2" />
        <div className="mt-5">
          <h2 className="text-3xl">Etymology</h2>
          <p className="text-xl">
            Shamelessly concocted from English music (from Greek mousikē) +
            hipster (1940s jazz slang, likely from hep, "in the know").
          </p>
        </div>
        <div className="mt-5">
          <h2 className="text-3xl">First Known Use</h2>
          <p className="text-xl">2024, in all the meanings defined above</p>
        </div>
      </div>
    </main>
  );
}
