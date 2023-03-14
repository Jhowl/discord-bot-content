import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateContent = async (content, hashtag) => {
  const contentHastag = hashtag ? ` add this additional hashtags: ${hashtag}` : ''
  const system = `I want you to act as a social media manger for Instagram and help me with creating content  to a post for my audience based on the content I provide, create in the end of the content emotes for the post and hashtags. I will give you some content. Please only provide content using content suggestions. Generate content in portuguese brazilian, with focus on the brazilian people who use instagram.`
  const prompt = `Here is the first content: \"${content}\"${contentHastag}`
  // console.log(prompt)
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: system},
        {role: "user", content: prompt},
      ],
    })

    console.log(response.data)

    return response.data.choices[0].message.content
  } catch (error) {
    console.error(error)
    return 'Error generating content.'
  }
}
