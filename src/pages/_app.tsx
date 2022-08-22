import '../styles/globals.css';
import { getSession, SessionProvider } from 'next-auth/react';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '@server/routers/_app';
import type { SSRContext } from '@utils/trpc';
import MainLayout from '@components/layouts/mainLayout';
import { AppType } from 'next/dist/shared/lib/utils';


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MainLayout session={pageProps.session}>
        <Component {...pageProps} />
      </MainLayout>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    pageProps: {
      session: await getSession(ctx),
    },
  };
};

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
       queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;
    if (ctx.req) {
      // on ssr, forward client's headers to the server
      return {
        ...ctx.req.headers,
        'x-ssr': '1',
      };
    }
    const error = opts.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }
    // For app caching with SSR see https://trpc.io/docs/caching
    return {};
  },
})(MyApp);
