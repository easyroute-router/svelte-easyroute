/// <reference types="svelte" />

import { SvelteComponentTyped } from 'svelte'
import Router from 'easyroute-core'

export interface RouterOutletProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  /**
   * @default null
   */
  transition?: string | null

  /**
   * @default false
   */
  forceRemount?: boolean

  /**
   * default "default"
   */
  name?: string
}

export interface RouterLinkProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  to: string
}

export default Router
export class RouterOutlet extends SvelteComponentTyped<RouterOutletProps> {}
export class RouterLink extends SvelteComponentTyped<RouterLinkProps> {}
export class EasyrouteProvider extends SvelteComponentTyped<{
  router: Router
}> {}
