import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

class HelperFunction {
  async checkExistingProject(project_name, project_dir) {
    const projectDir = project_dir ?? path.join(process.cwd(), project_name);
    if (fs.existsSync(projectDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `The project "${project_name}" already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);
      if (!overwrite) {
        console.log('Project creation aborted.');
        return false;
      }
    }
    return true;
  }
}

export const helperFunction = new HelperFunction();
