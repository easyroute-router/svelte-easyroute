const deleteLastSlash = (url) => url.replace(/\/$/, '')
const stripBase = (url, base) => (Boolean(base) ? url.replace(base, '') : url)

function configureEasyrouteSSR() {
  return async (renderOptions) => {
    const router = global.$$$easyrouteRouter
    if (!router)
      throw new Error("[Easyroute SSR] Couldn't find Router instance")
    const { component, props, url } = renderOptions

    let [pathname, search] = url.split('?')
    search = Boolean(search) ? '?' + search : ''
    pathname = deleteLastSlash(pathname) + '/'

    await router.push(stripBase(`${pathname}${search}`, router.base))
    return component.render({
      ...props
    })
  }
}

module.exports = configureEasyrouteSSR
