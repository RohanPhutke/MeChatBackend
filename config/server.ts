export default ({ env }: { env: any }) => ({
  host: env("HOST", "0.0.0.0"),
  url : env('PUBLIC_URL','https://worthy-delight-7f95d0519c.strapiapp.com'),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
