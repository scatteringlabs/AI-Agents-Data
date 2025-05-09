import Head from "next/head";

const PageHead = ({ headTitle }) => {
  return (
    <>
      <Head>
        <title>
          {headTitle
            ? headTitle
            : "Scattering | One-Stop Marketplace For Hybrid Assets"}
        </title>
      </Head>
    </>
  );
};

export default PageHead;
