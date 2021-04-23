import '../styles/global.scss'

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import style from '../styles/app.module.scss'
import { PlayerContextProvider } from '../contexts/PlayerContexts';

function MyApp({ Component, pageProps }) {

  return (
    <PlayerContextProvider>
      <div className={style.wrapper}>
        <main>

          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
