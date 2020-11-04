import axios from 'axios'
import { get } from 'svelte/store'
import { langStore } from '../Store'

export async function fetchSlugMarkdown(slug) {
  const lang = get(langStore)
  const requested = await axios.get(
    `http://localhost:3456/files/pages/${lang}/${slug}.md`
  )
  return requested.data
}
