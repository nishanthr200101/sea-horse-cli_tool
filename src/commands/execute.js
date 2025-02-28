import ora from 'ora';
import {libraries} from '../constants/libraries.js';
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { displayEnums } from '../constants/enum.js';
import { promisify } from 'util';

const execPromise = promisify(exec);

class ExecuteCommand {
  async replaceJSFilesWithTS({ projectDir }) {
    const files = await fs.readdir(projectDir);
    for (const file of files) {
      const filePath = path.join(projectDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await this.replaceJSFilesWithTS({ projectDir: filePath });
      } else if (file.endsWith('.js')) {
        const newFilePath = filePath.replace(/\.js$/, '.ts');
        await fs.rename(filePath, newFilePath);
      } else if (file.endsWith('.jsx')) {
        const newFilePath = filePath.replace(/\.jsx$/, '.tsx');
        await fs.rename(filePath, newFilePath);
      }
    }
  }
  
  async executeTypescript({ projectDir }) {
    const spinner = ora('Setting up Typescript...').start();
    await this.replaceJSFilesWithTS({ projectDir });
    spinner.succeed('Typescript setup done.');
  }

  async executeCSSFramwWork({ selectedTemplate, cssFramework, projectDir, useTypescript }) {
    const spinner = ora(`Setting up ${displayEnums[cssFramework]}...`).start();
  
    const {
      command, templates= {},replace={},
      overwrites_at_top={}, overwrites_at_bottom={},
    } = libraries(useTypescript)[selectedTemplate][cssFramework];
  
    await execPromise(`cd ${projectDir} && ${command}`, (err, _, stderr) => {
      if (err) {
        console.error(`Error installing ${displayEnums[cssFramework]}: ${stderr}`);
        return;
      }
      
      if(Object.keys(templates).length){
        Object.keys(templates).forEach(async (template) => {
          await fs.writeFile(path.join(projectDir, template), templates[template].trim());
        });
      }

      if(Object.keys(overwrites_at_top).length){
        Object.keys(overwrites_at_top).forEach(async (overwrite) => {
          const overwritePath = path.join(projectDir, overwrite);
          await fs.ensureFile(overwritePath);
          const existingContent = await fs.readFile(overwritePath, 'utf-8');
          const newContent = overwrites_at_top[overwrite].trim() + '\n' + existingContent;

          // Write combined content back to the file
          await fs.writeFile(overwritePath, newContent);
        });
      }

      if (Object.keys(overwrites_at_bottom).length) {
        Object.keys(overwrites_at_bottom).forEach(async (overwrite) => {
          const overwritePath = path.join(projectDir, overwrite);
          await fs.ensureFile(overwritePath);
          const existingContent = await fs.readFile(overwritePath, 'utf-8');
          const newContent =existingContent + '\n' + overwrites_at_bottom[overwrite].trim();

          // Write combined content back to the file
          await fs.writeFile(overwritePath, newContent);
        });
      }

      if (Object.keys(replace).length) {
        Object.keys(replace).forEach(async (overwrite) => {
          const overwritePath = path.join(projectDir, overwrite);
          const content = await fs.readFile(overwritePath, 'utf-8');
      
          const {from_replace, to_replace} = replace[overwrite];      

          await fs.writeFile(overwritePath, content.replaceAll(from_replace, to_replace));
        });
      }

      spinner.succeed(`${displayEnums[cssFramework]} installed successfully.`);
    });    
    return true;
  }

  async executeFramework({selectedTemplate, projectDir, templatesDir, project_name, useTypescript}){
    
    const templateDir = path.join(templatesDir, selectedTemplate);
    await fs.copy(templateDir, projectDir);
    
  
    const { scripts, main, browserslist, init_packages } = libraries(useTypescript)[selectedTemplate];

    const packageJsonData = {
      name : project_name,
      version : '1.0.0',
      scripts,
      main,
      browserslist,
    };
    await fs.writeJson(path.join(projectDir, 'package.json'), packageJsonData, { spaces: 2 });

    // typescript setup 
    if(useTypescript){
      await this.executeTypescript({projectDir});
    }
  
    const spinner = ora(`Setting up ${displayEnums[selectedTemplate]}...`).start();
    
    try {
      await execPromise(`cd ${projectDir} && npm install ${init_packages.join(' ')} ${useTypescript ? ' && npm install --save typescript @types/node @types/react @types/react-dom @types/jest' : ''}`);
      spinner.succeed(`${displayEnums[selectedTemplate]} setup done.`);
    } catch (err) {
      console.error(`Error installing ${selectedTemplate}: ${err.message}`);
      return false;
    }
    return true;
  }

  async runProject({projectDir}){
    await execPromise(`cd ${projectDir} && npm start`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Unable to run project: ${stderr}`);
          return;
        }
        console.log(`Project running successfully:\n${stdout}`);
      });
    return true;
  }
}

export const executeCommand = new ExecuteCommand();
