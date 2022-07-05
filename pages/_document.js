import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import theme from '../theme'
export default class MyDocument extends Document {
  render() {
    return (
      <Html
        xmlns='http://www.w3.org/1999/xhtml'
        lang='en-US'
        prefix='og: http://ogp.me/ns#'
      >
        <Head>
          {/* PWA primary color */}
          <meta name='theme-color' content={theme.palette.primary.main} />

          {/* @TODO - add in fab build variables. */}

          {/* {process.env.ALGOLIA_CSS_ENDPOINT ? (
            <script
              src={process.env.ALGOLIA_CSS_ENDPOINT}
              rel='stylesheet'
              type='text/css'
            ></script>
          ) : null} */}

          {/* Hubspot */}
          <script
            charset='utf-8'
            type='text/javascript'
            src='//js.hsforms.net/forms/v2.js'
          ></script>

          {/* JQuery Script */}
          <script
            src='https://code.jquery.com/jquery-3.6.0.min.js'
            integrity='sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4='
            crossOrigin='anonymous'
          ></script>

          {/* Piano Script */}
          <script
            src='//sandbox.tinypass.com/api/tinypass.min.js'
            async={false}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              tp = window.tp || [];
              tp.push(["setAid", 'ZuxImzpqsu']);
              tp.push(["setEndpoint", 'https://sandbox.tinypass.com/api/v3']);
              tp.push(["setUseTinypassAccounts", false ]);
              tp.push(["setUsePianoIdUserProvider", true ]);
              tp.push(["init", function() {
                  tp.experience.init();
                  tp.pianoId.init({
                    displayMode: 'modal',
                });
              }]);`,
            }}
          />

          {/* Snipcart Script */}
          <link rel='preconnect' href='https://app.snipcart.com' />
          <link rel='preconnect' href='https://cdn.snipcart.com' />
          <link
            rel='stylesheet'
            href='https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css'
          />
          <script
            async
            src='https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js'
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              <!-- Start of Adroll Pixel Code -->
                adroll_adv_id = "F6PWEMRB7RGWPFZ226C4MO";
                adroll_pix_id = "YFWTWQ23ZZALDFG75UNB5Z";
                adroll_version = "2.0";
            
                (function(w, d, e, o, a) {
                    w.__adroll_loaded = true
                    w.adroll = w.adroll || []
                    w.adroll.f = [ 'setProperties', 'identify', 'track' ]
                    var roundtripUrl = "https://s.adroll.com/j/" + adroll_adv_id
                            + "/roundtrip.js"
                    for (a = 0; a < w.adroll.f.length; a++) {
                        w.adroll[w.adroll.f[a]] = w.adroll[w.adroll.f[a]] || (function(n) {
                            return function() {
                                w.adroll.push([ n, arguments ])
                            }
                        })(w.adroll.f[a])
                    }
            
                    e = d.createElement('script')
                    o = d.getElementsByTagName('script')[0]
                    e.async = 1
                    e.src = roundtripUrl
                    o.parentNode.insertBefore(e, o)
                })(window, document)
                adroll.track("pageView")
                <!-- End Adroll Pixel Code -->
                `,
            }}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              <!-- Facebook Pixel Code -- pixel ID code is: 914910645227747>

              <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{your-pixel-id-goes-here}');
                fbq('track', 'PageView');
              </script>
              <noscript>
                <img height="1" width="1" style="display:none" 
                     src="https://www.facebook.com/tr?id={your-pixel-id-goes-here}&ev=PageView&noscript=1"/>
              </noscript>
              <!-- End Facebook Pixel Code -->
              `,
            }}
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              <!-- Start of HubSpot Embed Code -->
              <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/8020079.js"></script>
              <!-- End of HubSpot Embed Code -->
              <!-- Start of LinkedIn Embed Code -->
              <script type="text/javascript"> _linkedin_partner_id = "3361793"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id); </script><script type="text/javascript"> (function(){var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s);})(); </script> <noscript> <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=3361793&fmt=gif" /> </noscript>
              <!-- End of LinkedIn Embed Code -->
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
        <div
          hidden
          id='snipcart'
          data-api-key={process.env.NEXT_PUBLIC_SNIPCART_JS_DATA_API_KEY}
          data-config-modal-style='side'
        />
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}
