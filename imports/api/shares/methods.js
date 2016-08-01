import {ValidatedMethod} from 'meteor/mdg:validated-method';

export const shareOn = new ValidatedMethod({
  name: 'shares.shareOn',
  validate: null,
  run() {
    // if (!this.isSimulation) {

      const method = "GET"
      const pathDef = `https://www.linkedin.com/oauth/v2/accessToken`
      const params = 'shares'
      const queryParams = 'grant_type=authorization_code&code=AQR0SoM2fH56qZhmBIOPX_NnlYSRTL_mlftwp2yZgV1H832APjPeVUs9bcHCHs46uEw732-J3bVJY6FTkW0d8Sk5M3uqAzlDprMkCIKXgUrdIW_sPR4&redirect_uri=http%3A%2F%2Fdevtheleader.io&client_id=81s3pj6ixkpr2t&client_secret=M0Y29pkqrqr7HAxk'
      const requestUrl = `https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Fjackiekhuu.theleader.io&title=Leader%20public%20profile
&summary=My%20favorite%20developer%20program&source=theLeader.io`
      console.log(requestUrl)

      const data = {
        "comment": "Check out developer.linkedin.com!",
        "content": {
          "title": "LinkedIn Developers Resources",
          "description": "Leverage LinkedIn's APIs to maximize engagement",
          "submitted-url": "http://devtheleader.io",
          "submitted-image-url": "https://example.com/logo.png"
        },
        "visibility": {
          "code": "connections-only"
        }
      }
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      }

      HTTP.call(method, requestUrl,
        // {data},
        function (error, result) {
          if (!error) {
            console.log(`shared on linkedin`)
            console.log(result)
          } else {
            console.log(error)
          }
        })
    }
  // }
});