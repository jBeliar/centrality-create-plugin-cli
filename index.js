const { readFile, mkdir, writeFile, existsSync } = require('fs')
const { join } = require('path')
const { exec } = require('child_process')
const inquirer = require('inquirer')

const template = (description, keyWord, id) =>`

/*****************************************************/
const name = '${description}'
const keyword = '${keyWord}'

const init = async () => {
  
}

const queryResults = async query => {
  const words = []
  return words.map( word => ({
    path: word,
    value: word,
    icon: ''
  }))
}

const preview = async (query, item, setInput) => {
  if (!query) {
    return 'Enter the word'
  }
  
}

const onEnter = async (query, item, setInput) => {
  
}

exports.plugin = tools => {
  return {
    name,
    keyword,
    init,
    preview,
    queryResults,
    onEnter
  }
}
exports.id = '${id}'
`

var questions = [
  {
    type: 'input',
    name: 'id',
    message: "ID:",
    validate: value => {
      if (value) {
        return true;
      }
    }
  },
  {
    type: 'input',
    name: 'description',
    message: "Description:",
    validate: value => {
      if (value) {
        return true;
      }
    }
  },
  {
    type: 'input',
    name: 'keyWord',
    message: "Key word",
    validate: value => {
      if (value) {
        return true;
      }
    }
  }
];

const settingsPath = join(process.APPDATA, 'centrality', 'settings', 'settings.json')

const loadJsonAsync = path => {
  return new Promise( (resolve,reject) =>
    readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data))
    })
  )
}

loadJsonAsync(settingsPath)
  .then(settings => settings.pluginsPath)
  .then( async pluginsPath => {
    const answers = await inquirer.prompt(questions)
    const pluginPath = join(pluginsPath, 'plugin-' + answers.id)
    const content = template(answers.description, answers.keyWord, answers.id)
    if (existsSync(pluginPath)) {
      console.log('Plugin already exists')
      return
    }
    mkdir( pluginPath, e => {
      writeFile(join(pluginPath, 'index.js'), content, err => {
        if(err) { return console.log(err) }
        console.log("The plugin was created!");
        exec('code ' + pluginPath)
      });
    })
  })
