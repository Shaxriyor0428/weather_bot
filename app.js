const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");

const weatherKey = "e5f7a959222d33aca563f97fb92ae328";
const bot = new Telegraf(process.env.BOT_API);
bot.command("start", (ctx) => {
  ctx.reply(
    "Ob havo ma'lumotlarini olish botiga xush kelibsiz!\nO'zingiz turgan joyni Locatisiyasini kiriting"
  );
});
bot.on("message", async (ctx) => {
  if (ctx.message.location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${weatherKey}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      
      const tempInKelvin = data.main.temp;
      const tempInCelsius = tempInKelvin - 273.15;
      const windSeed = data.wind.speed;
      const clouds = data.clouds.all;

      const weatherDescription = clouds > 0 ? "Bulutli" : "Bulutsiz"

      const replyMessage = `
      Siz turgan Shaxar: ${data.name}
      - Harorat: ${tempInCelsius.toFixed(2)} °C
      - Shamol tezligi: ${windSeed} m/s
      - Havo: ${weatherDescription}
      `;
      ctx.reply(replyMessage);
    } catch (error) {
      ctx.reply("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
    }
  } else {
    ctx.reply("Siz xato ma'lumot kiritdingiz, iltimos faqat manzilingizni yuboring.");
  }
});

bot.launch();
