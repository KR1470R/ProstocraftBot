const mineflayer = require('mineflayer')
const readline = require("readline")
const {pathfinder, Movements, goals} = require("mineflayer-pathfinder")
const blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
const GoalBlock = goals.GoalBlock
const inventoryViewer = require("mineflayer-web-inventory")
const { Vec3 } = require('vec3')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const bot = mineflayer.createBot({
  host: 'mc.prostocraft.ru',
  // host: 'localhost',
  // port: 36601,
  username: 'tom34', // pass 5555

  version: '1.12.2'
})

let logined = false
let logginedSB = false
let listOfAccessibleOres = [
    1, // Stone
    4, // Coubblestone
    3, // Dirt block
    14, // Gold Ore
    15, // Iron Ore
    16, // Coal Ore
    21, // Lapis Lazulli Ore
    56, // Diamond Ore
    73, // Redstone Ore
    74, // Glowing Redstone Ore
    129, // Emerald Ore
    153, // Nether Quartz Ore
]
let statePossitionSB
let amountBlocksMustWillBeMined = 5

bot.loadPlugin(pathfinder)
bot.loadPlugin(require('mineflayer-collectblock').plugin)
bot.loadPlugin(blockFinderPlugin);

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
  // const goal = new GoalBlock(x,y,z)
  // bot.pathfinder.setGoal(goal)
  if (logginedSB) {
    console.log("Бот зайшов в СБ")
    bot.setQuickBarSlot(0)
    bot.look(0, 90)
    statePossitionSB = bot.entity.position

    if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+2, bot.entity.position.z)).type != 0) {
      console.log("Defined 1 block")
      bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+2, bot.entity.position.z)), err => { // 1 block diging
        if (err) throw err;
        if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+3, bot.entity.position.z)).type != 0) {
          console.log("Defined 2 block")
          bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+3, bot.entity.position.z)), err1 => { // 2 block diging
            if (err1) throw err1;
            if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+4, bot.entity.position.z)).type != 0) {
              bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 4, bot.entity.position.z)), err2 => { // 3 block diging
                if (err2) throw err2;
                if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+5, bot.entity.position.z)).type != 0) {
                  bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 5, bot.entity.position.z)), err3 => { // 4 block diging
                    if (err3) throw err3;
                    if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+6, bot.entity.position.z)).type != 0) {
                      bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 6, bot.entity.position.z)), err4 => { // 5 block diging
                        if (err4) throw err4;
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }

    // if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+1, bot.entity.position.z)) == undefined) {
    //   if (bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+1, bot.entity.position.z)) == undefined) {
    //
    //   }
    //   bot.dig(bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y+1, bot.entity.position.z)))
    // } else {
    //   bot.dig(block)
    // }


    // function miner () {
    //   for (let i = 0; i <= amountBlocksMustWillBeMined - 1; i++) {
    //     goalBlock = new Vec3(block.position.x, block.position.y + i, block.position.z)
    //
    //     function mine () {
    //       if (bot.blockAt(goalBlock)) {
    //         console.log("Block finded")
    //         console.log("goal block: ", goalBlock)
    //         console.log(block.type)
    //         if (listOfAccessibleOres.includes(bot.blockAt(goalBlock).type)) {
    //           console.log("it is true type")
    //           bot.dig(bot.blockAt(goalBlock), (err) => {
    //             if (err) {
    //               console.log(err)
    //             }
    //
    //             mine()
    //           })
    //           // bot.collectBlock.collect(bot.blockAt(goalBlock), err => {
    //           //   console.log("mine")
    //           //   if (err) {
    //           //     console.log(err)
    //           //   } else {
    //           //     bot.look(0, 90)
    //           //     bot.entity.position = statePossitionSB
    //           //     mine()
    //           //     if (i == 5) {
    //           //       miner()
    //           //     }
    //           //   }
    //           // })
    //         }
    //       }
    //     }
    //     mine()
    //   }
    // }
    // miner()

    return
  }
  bot.setQuickBarSlot(0)
  bot.activateItem()
})

bot.on("windowOpen", window => {
  console.log("################################################")

  for (let i of Object.keys(mineflayer.ScoreBoard.positions["1"].itemsMap)) {
    if (i.includes("Хаб")) console.log("Номер хаба: ",i.match(/(\d)/i)[0])
  }
  //16
  let nameWindow = JSON.parse(window.title).extra[0].text; nameWindow = nameWindow.substring(0, nameWindow.length-2)
  console.log(`Iм'я вiкна: ${nameWindow}`)
  switch (nameWindow) {
    // 16 - 7; 21 - 10
    case "Выбор сервера": bot.clickWindow(21,0,0); break
    case "Выбор иг" : bot.clickWindow(10, 0, 0); logginedSB = true; break
  }

  for (let i of window.slots) {
    if (i) {
      // console.log(JSON.parse(i.nbt.value.display.value.Name.value).extra[0].text) // 1.16.1
      console.log(i.nbt.value.display.value.Name.value)
    }
  }
  console.log("################################################\n")

})

bot.on("windowClose", window => {
  console.log('Window closed')
})
