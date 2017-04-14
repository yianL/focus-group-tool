// @flow
import fs from 'fs';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import parse from 'csv-parse';
import stringify from 'csv-stringify';
import MenuBuilder from './menu';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    // TODO: Use async interation statement.
    //       Waiting on https://github.com/tc39/proposal-async-iteration
    //       Promises will fail silently, which isn't what we want in development
    return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .catch(console.log);
  }
};

app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

ipcMain.on('open-file-dialog', (event) =>
  dialog.showOpenDialog({
    properties: ['openFile']
  }, (files) => {
    if (!files || files.length < 1) { return; }

    event.sender.send('selected-file', files);
    fs.readFile(files[0], 'utf8', (err, data) => {
      if (err) throw err;
      parse(data, { autoParse: true }, (error, result) => {
        if (error) throw error;
        event.sender.send('file-loaded', result);
      });
    });
  })
);

ipcMain.on('export-csv', (event, data) => {
  dialog.showSaveDialog({
    title: 'Save Focus Group to CSV',
    defaultPath: 'focusGroup.csv',
    filters: [{
      name: 'CSV Files',
      extensions: ['csv'],
    }]
  }, (filename) => {
    if (!filename) { return; }

    stringify(data, (err, output) => {
      if (err) {
        console.error('Error stringifying focus group', err);
        return;
      }

      fs.writeFile(filename, output, (error) => {
        if (error) {
          console.error('Error writing to file: ', error);
          return;
        }

        console.log('File written:', filename);
      });
    });
  });
});
