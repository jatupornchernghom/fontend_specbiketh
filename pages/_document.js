import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="จักรยาน TWITTER KAZE STORM จักรยานเสือหมอบ" />
          <meta name="keywords" content="bikes, bicycles, เปลียบเทียบ, จักรยานเสือหมอบ" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://specbikethailand.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
