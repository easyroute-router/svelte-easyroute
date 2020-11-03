import axios from 'axios'

export async function fetchSlugMarkdown(slug) {
  const requested = await axios.get(`http://localhost:8080/pages/${slug}.md`)
  return requested.data
}
