EventTemplate.build('game.start',{

  stages:[{
    background:'new-game-2',
    pages: [
      { text:`Page 1` },
      { text:`Page 2` },
      { text:`Page 3` },
    ]
  },{
    background:'town',
    pages: [
      { text:`Walk about town...` }
    ]
  },{
    background:'guild',
    pages: [
      { text:`Talk to the guildmistress...` }
    ]
  }],

  onFinish: async choices => {
    console.log("[game.start] On Finish");
  },

});
