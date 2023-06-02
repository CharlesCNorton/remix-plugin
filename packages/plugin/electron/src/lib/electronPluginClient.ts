import { ClientConnector, connectClient, applyApi, Client, PluginClient } from '@remixproject/plugin'
import type { Message, Api, ApiMap, Profile } from '@remixproject/plugin-utils'
import { IRemixApi } from '@remixproject/plugin-api'
import { ipcMain } from 'electron'

export class ElectronPluginClientConnector implements ClientConnector {

    constructor(public profile: Profile, public mainWindow: Electron.BrowserWindow) { 
    }

    /** Send a message to the engine */
    send(message: Partial<Message>) {
        this.mainWindow.webContents.send(this.profile.name + ':send', message)
    }

    /** Listen to message from the engine */
    on(cb: (message: Partial<Message>) => void) {
        ipcMain.on(this.profile.name + ':on', (event, message) => {
            cb(message)
        })
    }
}

export const createElectronClient = <
    P extends Api,
    App extends ApiMap = Readonly<IRemixApi>
>(client: PluginClient<P, App> = new PluginClient(), profile: Profile
, mainWindow: Electron.BrowserWindow
): Client<P, App> => {
    const c = client as any
    connectClient(new ElectronPluginClientConnector(profile, mainWindow), c)
    applyApi(c)
    return c
}