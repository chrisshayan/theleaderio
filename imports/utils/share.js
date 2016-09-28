
export const shareOn = (name) => {
  switch (name) {
    case 'linkedin':
      shareOnLinkedin()
      break
    case 'tweeter':
      shareOnTweeter()
      break
    case 'facebook':
      shareOnFacebook()
      break
  }
}

const shareOnLinkedin = () => {
  const method = "GET"
  const pathDef = `https://api.linkedin.com/v1/people/~`
  const params = 'shares'
  const queryParams = 'format=json'
  const requestUrl = `https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Fjackiekhuu.theleader.io&title=Leader%20public%20profile
&summary=My%20favorite%20developer%20program&source=theLeader.io`
  console.log(requestUrl)

  const data = {
    "comment": "Check out developer.linkedin.com!",
    "content": {
      "title": "LinkedIn Developers Resources",
      "description": "Leverage LinkedIn's APIs to maximize engagement",
      "submitted-url": "http://jackiekhuu.devtheleader.io",
      "submitted-image-url": "https://example.com/logo.png"
    },
    "visibility": {
      "code": "connections-only"
    }
  }
  const headers = {
    "state": "987654321",
    "Content-Type": "application/json",
    "x-li-format": "json"
  }

  HTTP.call(method, requestUrl,
    // {data},
    function (error, result) {
      if (!error) {
        console.log(`shared on linkedin`)
        console.log(result)
      } else {
        console.log(`error`)
        console.log(error)
      }
    })
  // HTTP.call(method, requestUrl);
}

const shareOnTweeter = () => {

}

const shareOnFacebook = () => {

}