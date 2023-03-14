import './config/dotenv.js'

import { Client, GatewayIntentBits, Routes, SlashCommandBuilder } from 'discord.js'
import { REST } from '@discordjs/rest'
import { generateContent } from './content.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const commandName = interaction.commandName
  const args = interaction.options

  console.log(`Received command: ${commandName} ${args} `)

  if (commandName === 'generate-instagram-content') {
    await interaction.deferReply();
    const content = args.getString('content')
    const hashtag = args.getString('hashtag')

    // await interaction.reply({ content: 'Working on it...', ephemeral: false })

    try {
      const generatedContent = await generateContent(content, hashtag)
      console.log(generatedContent)
      await interaction.editReply(`Generated content: ${generatedContent}`)
    } catch (error) {
      console.error(error)
      await interaction.editReply('Error generating content.')
    }
  }  else {
    await interaction.reply('Unknown command.')
  }
})


async function main() {
  const openaiCommands = new SlashCommandBuilder()
    .setName('generate-instagram-content')
    .setDescription('Generates Instagram content')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('Tipo de conteudo que deseja gerar')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('hashtag')
        .setDescription('Hashtags específicas que você deseja incluir')
        .setRequired(false))




    const commands = [openaiCommands.toJSON()]

  try {
    console.log('Started refreshing application (/) commands.')
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), {
      body: commands,
    })

    client.login(process.env.DISCORD_TOKEN)
    console.log('Bot is running...')
  } catch (error) {
    console.error(error)
  }
}

main()


