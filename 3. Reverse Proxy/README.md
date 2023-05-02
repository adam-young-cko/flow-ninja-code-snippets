The current website has the following reverse proxy setup for our documentation site. This will need to replicated on your end to ensure consistency with existing links:

```js
 const rewrites = {
    {
      source: "/docs/previous",
      destination: `https://checkout-docs-site.vercel.app/docs/previous`,
    },
    {
      source: "/docs/previous/:slug*",
      destination: `https://checkout-docs-site.vercel.app/docs/previous/:slug*`,
    },
    {
      source: "/docs",
      destination: `https://checkout-docs-site-nas.vercel.app/docs`,
    },
    {
      source: "/docs/:slug*",
      destination: `https://checkout-docs-site-nas.vercel.app/docs/:slug*`,
    }
}
```

Within the above example, `:slug*` represents a catch-all for anything after the URL path. `/docs/abc/def` would be rewritten to `https://checkout-docs-site-nas.vercel.app/docs/abc/def`.

This also needs to work without any `:slug*`, `/docs` should go to `https://checkout-docs-site-nas.vercel.app/docs`.
