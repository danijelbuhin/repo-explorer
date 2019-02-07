export default function generateTopic({
  topics,
  language,
}) {
  if (language) {
    return language;
  }
  if (topics.length > 0 && !language) {
    return topics[0];
  }
  return null;
}
