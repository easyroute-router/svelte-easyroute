import { SvelteComponent } from 'svelte/internal'

declare type RenderResult = {
  html: string
  css: {
    code: string
    map: null
  }
  head: string
}

declare type RenderOptions = {
  url: string
  props: {
    [key: string]: any
  }
  component: SvelteComponent
}

declare type renderFunction = (
  renderOptions: RenderOptions
) => Promise<RenderResult>

declare function configureEasyrouteSSR(): renderFunction

export default configureEasyrouteSSR
