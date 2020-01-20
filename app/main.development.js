// @flow
import fs from 'fs';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import parse from 'csv-parse';
import settings from 'electron-settings';
import stringify from 'csv-stringify';
import MenuBuilder from './menu';
import { COLUMNSBYID } from './utils/constants';
import { migrationSaveNameEmailDate } from './utils/migrations';

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

  // run all migrations
  migrationSaveNameEmailDate(settings);

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
        const pastParticipants = settings.get('pastParticipants')
          .filter(p => !p.released)
          .map(p => p.email);
        const filteredOut = [];
        const included = [];
        const candidates = result.filter((person) => {
          const email = person[COLUMNSBYID.email.index - 1].toLowerCase();
          if (pastParticipants.includes(email) || included.includes(email)) {
            filteredOut.push(person);
            return false;
          }
          included.push(email);
          return true;
        });
        event.sender.send('file-loaded', {
          candidates,
          filteredOut,
        });
      });
    });
  })
);

ipcMain.on('open-load-dialog', (event) =>
  dialog.showOpenDialog({
    properties: ['openFile']
  }, (files) => {
    if (!files || files.length < 1 || !files[0].endsWith('.json')) { return; }

    fs.readFile(files[0], 'utf8', (err, data) => {
      if (err) throw err;
      try {
        const appState = JSON.parse(data);
        event.sender.send('state-loaded', appState);
      } catch (e) {
        console.error('Error parsing application state JSON', e);
      }
    });
  })
);

ipcMain.on('open-save-dialog', (event, data) =>
  dialog.showSaveDialog({
    title: 'Save application state',
    defaultPath: 'focusGroupState.json',
    filters: [{
      name: 'Json Files',
      extensions: ['json'],
    }]
  }, (filename) => {
    if (!filename) { return; }
    const appState = JSON.stringify(data);
    fs.writeFile(filename, appState, (error) => {
      if (error) {
        console.error('Error writing to file: ', error);
        return;
      }

      console.log('File written:', filename);
    });
  })
);

ipcMain.on('export-csv', (event, data) => {
  const { groupName, group } = data;
  dialog.showSaveDialog({
    title: 'Save Focus Group to CSV',
    defaultPath: `${groupName || 'focusGroup'}.csv`,
    filters: [{
      name: 'CSV Files',
      extensions: ['csv'],
    }]
  }, (filename) => {
    if (!filename) { return; }

    stringify(group, (err, output) => {
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

ipcMain.on('save-to-db', (event, { data, groupDate }) => {
  const pastParticipants = settings.get('pastParticipants');
  const now = Date.now();
  const toSave = data.map(ent => ({
    name: ent.name,
    email: ent.email,
    createdAt: now,
    lastFocusGroupDate: groupDate,
    released: false,
  })).filter(ent => {
    const idx = pastParticipants.findIndex(p => p.email === ent.email.toLowerCase());
    if (idx < 0) {
      // not found, save to DB
      return true;
    }

    // already in DB, just update the entry
    pastParticipants[idx].released = false;
    pastParticipants[idx].lastFocusGroupDate = groupDate;

    return false;
  });

  settings.set('pastParticipants', pastParticipants.concat(toSave));
  event.sender.send('saved', { data, groupDate });
});

ipcMain.on('db-get', (event, { key }) => {
  const data = settings.get(key);
  event.sender.send('db-got', { key, data });
});

ipcMain.on('clear-db', () => {
  settings.set('pastParticipants', []);
  console.log('DB purged');
});
