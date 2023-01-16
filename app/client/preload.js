const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ClientCommands", {
  ready: async () => { return ipcRenderer.invoke("client.ready"); } 
});

contextBridge.exposeInMainWorld("ServerEvents", {
  onReady: (callback) => { ipcRenderer.on("server.ready", callback); }
});
