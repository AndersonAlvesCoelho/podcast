import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { ConvertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../contexts/PlayerContexts';

import styles from './home.module.scss';

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes]
  return (
    <div className={styles.homePage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>útimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((latEp, index) => {
            return (
              <li key={latEp.id}>
                <Image
                  width={192}
                  height={192}
                  src={latEp.thumbnail}
                  alt={latEp.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${latEp.id}`}>
                    <a >{latEp.title}</a>
                  </Link>
                  <p>{latEp.members}</p>
                  <span>{latEp.publishedAt}</span>
                  <span>{latEp.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((allEp, index) => {
              return (
                <tr key={allEp.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={190}
                      src={allEp.thumbnail}
                      alt={allEp.title}
                      objectFit="cover"
                    />
                  </td>

                  <td>
                    <Link href={`/episodes/${allEp.id}`}>
                      <a >{allEp.title}</a>
                    </Link>
                  </td>
                  <td>{allEp.members}</td>
                  <td style={{ width: 100 }}>{allEp.publishedAt}</td>
                  <td>{allEp.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limut: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(ep => {
    return {
      id: ep.id,
      title: ep.title,
      thumbnail: ep.thumbnail,
      members: ep.members,
      publishedAt: format(parseISO(ep.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(ep.file.duration),
      durationAsString: ConvertDurationToTimeString(Number(ep.file.duration)),
      url: ep.file.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

// SPA
// useEffect(() => {
//   fetch('http://localhost:3333/episodes')
//     .then(res => res.json())
//     .then(data => console.log(data));

// }, []);
// SSR
// export async function getServerSideProps() {

//   const res = await fetch('http://localhost:3333/episodes')
//   const data = await res.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }

// }
//SSG
// export async function getStaticProps() {

//   const res = await fetch('http://localhost:3333/episodes')
//   const data = await res.json();

//   return {
//     props: {
//       episodes: data,
//     },
//     revalidate: 60 * 60 * 8,
//   }

// }