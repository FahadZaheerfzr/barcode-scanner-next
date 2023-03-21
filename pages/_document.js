import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <meta http-equiv="ScreenOrientation" content="autoRotate:disabled" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
