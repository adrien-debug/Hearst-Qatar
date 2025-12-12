import { NextPageContext } from 'next';
import Head from 'next/head';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592
    // As a workaround, we pass err via _app.tsx so it can be captured
  }

  return (
    <>
      <Head>
        <title>Erreur - 100MW QATAR</title>
        <meta name="description" content="Une erreur s'est produite" />
      </Head>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-[#0b1120] mb-4">
            {statusCode ? `Erreur ${statusCode}` : 'Une erreur s\'est produite'}
          </h1>
          <p className="text-lg text-[#64748b] mb-8">
            {statusCode === 404
              ? 'Cette page n\'existe pas.'
              : statusCode === 500
              ? 'Une erreur serveur s\'est produite.'
              : 'Une erreur inattendue s\'est produite.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold rounded-[8px] transition-colors"
            >
              Retour
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-[#0b1120] hover:bg-[#1a1f2e] text-white font-semibold rounded-[8px] transition-colors"
            >
              Accueil
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode, hasGetInitialPropsRun: true, err };
};

export default Error;
