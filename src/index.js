const mineflayer = require('mineflayer')
const readline = require("readline")
const {pathfinder, Movements, goals} = require("mineflayer-pathfinder")
const GoalBlock = goals.GoalBlock
const inventoryViewer = require("mineflayer-web-inventory")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const bot = mineflayer.createBot({
  host: 'mc.prostocraft.ru',
  // host: 'localhost',
  // port: 40217,
  username: 'kript2', // email and password

  version: '1.12.2'
  // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

let logined = false

bot.loadPlugin(pathfinder)

bot._client.once('map', (map) => {
  const size = Math.sqrt(map.data.length)

  // Make an histogram of the colors
  const h = {}
  for (const v of map.data) {
    if (!h[v]) h[v] = 0
    h[v]++
  }

  const colors = Object.entries(h).sort((a, b) => b[1] - a[1]).map(x => parseInt(x[0], 10))
  const fg = colors[1]

  // Display the image as ascii
  if (!logined) {
    for (let i = 0 ; i < size ; i++) {
      let line = ''
      for (let j = 0 ; j < size ; j++) {
        let v = map.data[i * 128 + j]
        line += (v != fg) ? ' ' : '#'
      }
      console.log(line)
    }
    logined = true
  } else return;

})


let messagetmp;
bot.on('chat', function (username, message) {
  if (username === bot.username) return;
  if (message == messagetmp) return;
  messagetmp = message
  console.log(`\n<${username}> ${message}`)
  callChat()
})

function callChat() {
  rl.question(">>> ", (n) => {
    bot.chat(n) // gives the answer
    // rl.close()
    callChat()
  })
};callChat()

bot.on('kicked', (reason, loggedIn) => {
  console.log('\n<<< KICKED >>>\n')
  console.log(reason, loggedIn)
  process.exit(1) 
})
bot.on('error', err => {
  console.log(err)
  process.exit(1) 
})

bot.on('spawn', () => {
  const mcData = require("minecraft-data")(bot.version)
  const movements = new Movements(bot, mcData)
  movements.scafoldingBlocks = []
  bot.pathfinder.setMovements(movements)
  let x = 11.666
  let y = 53.50000
  let z = 45.939
  bot.setQuickBarSlot(2)
  const goal = new GoalBlock(x,y,z)
  bot.pathfinder.setGoal(goal)
  bot.activateItem()
  // bot.upda
  // bot.clickWindow(1,1,mineflayer.Chest.window)
  // bot.clickWindow(36,1,mineflayer.Chest.window, err => {
  //   console.log(err)
  // })
})

let c = 0
bot.on("windowOpen", window => {
  for (let i of Object.keys(mineflayer.ScoreBoard.positions["1"].itemsMap)) {
    if (i.includes("Хаб")) console.log("Hub num: ",i.match(/(\d)/i)[0])
  }
  console.log()
  // console.log(bot.inventory)
  // bot.closeWindow(window)
  // for (let i of window.slots) {
  //   if (!i) {
  //     c++;
  //     // console.log(i.nbt.value.display.value.Name.value)
  //     // console.log("chest", mineflayer.Chest.window)
  //     //console.log(i.nbt.value)
      
  //     // console.log(bot.inventory.slots)
  //     // console.log(bot.inventory.clickWindow);
      
  //   }
  // }
  // console.log(c)
  // bot.equip()
})

bot.on("windowClose", window => {
  console.log(window.slots)
})
