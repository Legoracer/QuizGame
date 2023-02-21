
export default function Post(props) {
  console.log(`id here: ${props.id}`)
  return (
    <><h1>
      {props.id}
    </h1><h2>
        {props.host}
      </h2></>
  )
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  console.log(params.id) // good
  let response = await fetch(`http://localhost:8080/api/lobby/${params.id}`, {
    method: "GET"
  })
  let json = await response.json();

  console.log(json)

  return {
    props: json.lobby || {}
  }
}