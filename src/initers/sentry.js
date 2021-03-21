import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: 'https://3743a801a9d74d289e8215f66ff2085d@sentry.io/1729005',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});
