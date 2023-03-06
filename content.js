import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateContent = async (content, hashtag) => {
  const contentHastag = hashtag ? ` add this additional hashtags: ${hashtag}` : ''
  const prompt = `I want you to act as a social media manger for Instagram and help me with creating content  to a post for my audience based on the content I provide, create in the end of the content emotes for the post and hashtags. I will give you some content. Please only provide content using content suggestions. Generate content in portuguese brazilian, with focus on the brazilian people who use instagram. Here is the first content: "${content}"${contentHastag}`
  console.log(prompt)
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.9,
      max_tokens: 1200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      // stop: '\n'
    })
    return response.data.choices[0].text
  } catch (error) {
    console.error(error)
    return 'Error generating content.'
  }
}
