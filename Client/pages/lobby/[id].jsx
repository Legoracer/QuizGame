import idGenerator from "adjective-noun-generator"

export default function Post(props) {
  console.log(`id here: ${props.id}`)
  return (
    <h1>
      {props.id}
    </h1>
  )
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  return {
    paths: [{params: { id: ""}} ],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  console.log(`id: ${params.id}`)
  return {
    props: {
      id: params.id || 0
    }
  }
}

/*
idGenerator({
        separator: "-"
      }).toLowerCase()
*/