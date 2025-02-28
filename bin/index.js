#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import inquirer from 'inquirer';
import figlet from 'figlet';
import chalk from 'chalk';
import { helperFunction } from '../src/utils/helper.js';
import { executeCommand } from '../src/commands/execute.js';
import { templateEnums } from '../src/constants/enum.js';

console.log(
  chalk.yellow(figlet.textSync('WELCOME TO DEV CLI TOOLS', { horizontalLayout: 'full' }))
);

program
  .version('1.0.0')
  .description('Project Scaffolding CLI for React, Next.js, and Tailwind CSS');

program
  .command('--help')
  .description('Display help information for the CLI')
  .action(() => {
    console.log(`
    Available commands:
    create <project-name>  Create a new project with the specified template
    --help                                          Display help information for the CLI
    `);
  });

program
  .command('create <project-name>')
  .description('Create a new project and set up Libraries')
  .action(async (project_name) => {
    const projectDir = path.join(process.cwd(), project_name);
    if (!await helperFunction.checkExistingProject(project_name, projectDir)) {
      return;
    }

    const templatesDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../templates');
    const { selectedTemplate, cssFramework, useTypescript, stateManagement } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: 'Which project template would you like to use?',
        choices: [templateEnums.REACT, templateEnums.NEXTJS],
      },
      {
        type: 'confirm',
        name: 'useTypescript',
        message: 'Would you like to set up the project with TypeScript?',
        default: false,
      },
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Which CSS framework would you like to use?',
        choices: [templateEnums.TAILWIND, templateEnums.BOOTSTRAP, templateEnums.NOT_REQUIRED],
      },
      {
        type: 'list',
        name: 'stateManagement',
        message: 'Which state management solution would you like to use?',
        choices: [templateEnums.REDUX, templateEnums.CONTEXT_API, templateEnums.NOT_REQUIRED],
      }
    ]);

    const projectRequirements = {
      projectDir, templatesDir, selectedTemplate, cssFramework, useTypescript,project_name,
    };


    // framework setup
    if(selectedTemplate){
      await executeCommand.executeFramework(projectRequirements);
    }

    // css framework setup
    if (cssFramework !== templateEnums.NOT_REQUIRED) {
      await executeCommand.executeCSSFramwWork(projectRequirements);
    }


    // state management setup
    if (stateManagement !== templateEnums.NOT_REQUIRED) {
      console.log('StateManagement-->',stateManagement);
    }

    
    await executeCommand.runProject(projectDir);
    console.log(`Project "${project_name}" created successfully using the "${selectedTemplate}" template.`);

  });

program.parse(process.argv);
