// import { useEffect } from "react"

export default function Home(props) {

  // SPA 
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(res => res.json())
  //     .then(data => console.log(data));

  // }, []);


  return (
    <div>
      <h1>Hello Word</h1>
      {/* {JSON.stringify(props.episodes)} */}
    </div>
  )
}

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
export async function getStaticProps() {

  const res = await fetch('http://localhost:3333/episodes')
  const data = await res.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }

}