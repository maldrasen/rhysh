const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ClientCommands", {
  send: async (command, parameters=[]) => { return ipcRenderer.invoke(command, parameters) },
  ready: async () => { return ipcRenderer.invoke("client.ready") },
  loadTemplate: async (path) => { return ipcRenderer.invoke("client.loadTemplate", path) },
});

contextBridge.exposeInMainWorld("ServerEvents", {
  onReady: (callback) => { ipcRenderer.on("server.ready", callback) },
  onRender: (callback) => { ipcRenderer.on("render", callback) },
  onRenderBattleRound: (callback) => { ipcRenderer.on("render-battle-round", callback) },
});
