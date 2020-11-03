function configureEasyrouteSSR() {
  return async (renderOptions) => {
    const router = global.$$$easyrouteRouter
    if (!router)
      throw new Error("[Easyroute SSR] Couldn't find Router instance")
    const { component, props, url } = renderOptions
    await router.push(url)
    return component.render({
      ...props
    })
  }
}

module.exports = configureEasyrouteSSR
