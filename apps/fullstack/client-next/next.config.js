const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('next/constants');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const newUrl = `https://${process.env.HEAD_REF ? process.env.HEAD_REF : ''}${
  process.env.HEAD_REF ? '--' : ''
}bi-service-5g7d5fmura-ew.a.run.app/api/:path*`;

// module.exports = withNx(nextConfig);
module.exports = (phase) => {
  console.log('HEAD_REF', process.env.HEAD_REF);
  console.log('newUrl', process.env.newUrl);
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`); // eslint-disable-line

  const microServiceRoutesMapping = [
    {
      source: '/gateway/service1',
      // basePath: false,
      // description: "http://0.0.0.0:5000/:path*"
      destination: isDev
        ? 'http://localhost:5000'
        : 'https://aris-ars-j0dquon.uk.gateway.dev/service1',
    },
    {
      source: '/gateway/service2',
      // basePath: false,
      // description: "http://0.0.0.0:5000/:path*"
      destination: isDev
        ? 'http://localhost:5001'
        : 'https://aris-ars-j0dquon.uk.gateway.dev/service2',
    },
    {
      source: '/gateway/service1',
      // basePath: false,
      // description: "http://0.0.0.0:5000/:path*"
      destination: isDev
        ? 'http://localhost:5000'
        : 'https://aris-ars-j0dquon.uk.gateway.dev/service1',
    },
    {
      source: '/api/:path*',
      // basePath: false,
      // description: "http://0.0.0.0:5000/:path*"
      destination: isDev
        ? 'http://localhost:3333/api/:path*'
        : `https://bi-service-5g7d5fmura-ew.a.run.app/api/:path*`,
    },
  ];

  return {
    async rewrites() {
      return microServiceRoutesMapping;
    },
  };
};
