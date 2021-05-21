const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require("electron")
const path = require("path")
const url = require("url")

// Added global variables so we can close and add windows from inside functions
let mainWindow;
let addWindow;


app.on('ready', () => {
    //create the main windwo
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    })

    //create the main menu
    const menu = Menu.buildFromTemplate(menuTemplate)

    let windowHtmlPath = path.join(__dirname,"windowHtml.html")
    mainWindow.loadFile(windowHtmlPath)
    mainWindow.setMenu(menu)

    mainWindow.on('closed', function(){ // notice that this is closed
        app.quit()
    })

    
})

ipcMain.on('item:add', function(e,item){
    mainWindow.webContents.send("item:add",item)
    addWindow.close()
})


// open the create add function
function createAddFunction(){
    //create the main windwo
    addWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: "Add Shopping List Item",
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    })

    //create the main menu
    const menu = Menu.buildFromTemplate(menuTemplate)

    let addWindowHtmlPath = path.join(__dirname,"addWindow.html")
    addWindow.loadFile(addWindowHtmlPath)
    addWindow.setMenu(menu)

    addWindow.on('close', function(){ // notice that this is closed
        addWindow = null
    })
}


// create menu template for the app
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Item",
                click(){
                    createAddFunction()
                }
            },
            {
                label: "Clear Items",
                click(){
                    mainWindow.webContents.send("item:clear") // use the mainWindow.webContents to send message. ipcRender and ipcMain are for receiving
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click(){
                    app.quit()
                }
            },
        ]
    }
]


//if you are on a mac then fix the menu
if(process.platform == 'darwin'){
    menuTemplate.unshift({})
}

//if you are in development mode
if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: "Dev Tools",
        submenu: [
            {
                label: "Toggle Dev Tools",
                accelerator: process.platform == 'darwin'? "Command+I" : "Ctrl+I",
                click(item, focusedWindow){
                    //focusedWindow.webContents.toggleDevTools()
                    focusedWindow.toggleDevTools() // you can use both of these

                }
            },
            {
                role: 'reload' // With this you can reload the app when you update the code
            },
            {
                role: 'toggleDevTools'
            }
        ]
    })
}