import { useState } from "react";
import { Link } from "react-router-dom";
import makeid from "../../utils/randomCodeGenerator";

export default function UnoMain() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      <div className="w-screen h-screen bg-slate-100">
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
              Let's Play Card Game
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow-md sm:rounded-xl rounded-lg sm:px-12 dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10">
              <form className="space-y-4">
                <div>
                  <div>
                    <input
                      type="text"
                      placeholder="Player's Name"
                      className="block text-center w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-400"
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <input
                      type="text"
                      placeholder="Game Code"
                      disabled={!name}
                      className="block text-center w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-400 disabled:bg-gray-100"
                      onChange={(event) => setRoomCode(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Link
                    to={`/uno/room?roomCode=${roomCode}&name=${name}`}
                    aria-disabled={!roomCode}
                    className="flex w-full justify-center rounded-md px-3 py-2 text-sm/6 font-semibold shadow-xs bg-indigo-500 text-white hover:bg-indigo-400 dark:bg-indigo-400 aria-disabled:bg-indigo-200 aria-disabled:pointer-events-none"
                  >
                    Join Game
                  </Link>
                </div>
              </form>

              <div>
                <div className="mt-6 flex items-center gap-x-6">
                  <div className="w-full flex-1 border-t border-gray-200 dark:border-white/10" />
                  <p className="text-sm/6 font-medium text-nowrap text-gray-900 dark:text-white">
                    Or
                  </p>
                  <div className="w-full flex-1 border-t border-gray-200 dark:border-white/10" />
                </div>

                <div className="mt-6 grid">
                  <Link
                    to={`/uno/room?roomCode=${makeid(5)}&name=${name}`}
                    aria-disabled={!name}
                    className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm/6 bg-white text-gray-900 hover:bg-gray-50 inset-ring inset-ring-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 font-semibold shadow-xs aria-disabled:bg-gray-300 aria-disabled:text-gray-400 aria-disabled:pointer-events-none"
                  >
                    Create Game
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
