
const get = function() {

}

export const scoringLeader = function({recipient, sender, Subject, timestamp, content}) {
  const score = Number(content);
  if(isNaN(score)) {
    return `send error email - reply should be number`;
  }
  if(score > 0 && score <= 5) {
    return `insert score into metrics, send feedback email`;
  } else {
    return `send error email - reply should be from 1 to 5`;
  }
}

export const feedbackLeader = function({recipient, sender, Subject, timestamp, content}) {
  const feedback = content;
  return `send thank you email`;
}