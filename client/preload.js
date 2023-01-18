const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ClientCommands", {
  send: async (command, data={}) => { return ipcRenderer.invoke(command, data) },
  ready: async () => { return ipcRenderer.invoke("client.ready") },
  loadTemplate: async (path) => { return ipcRenderer.invoke("client.loadTemplate", path) },
});

contextBridge.exposeInMainWorld("ServerEvents", {
  onReady: (callback) => { ipcRenderer.on("server.ready", callback) }
});
