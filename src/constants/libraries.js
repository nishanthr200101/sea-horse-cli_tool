export const libraries =(isTs) => ({
  react: {
    scripts:{
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject'
    },
    main: `src/index.${isTs ? 'tsx' : 'jsx'}`,
    browserslist: {
      production: [
        '>0.2%',
        'not dead',
        'not op_mini all'
      ],
      development: [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
      ]
    },
    init_packages:['react','react-scripts','react-dom'],
    tailwind: {
      command :'npm install -D tailwindcss@3',
      templates: {
        'tailwind.config.js':`
    module.exports = {
      purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
      darkMode: false, // or 'media' or 'class'
      theme: {
        extend: {},
      },
      variants: {
        extend: {},
      },
      plugins: [],
    };
    `,
      },
      overwrites_at_top:{
        'src/index.css':`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `,
      },
      replace:{
        [`src/App.${isTs ? 'tsx' : 'jsx'}`]:{
          from_replace:'SEA HORSE' ,
          to_replace: 'SEA HORSE & TAILWIND CSS'
        }
      },
      overwrites_at_bottom:{
        [`src/App.${isTs ? 'tsx' : 'jsx'}`]:`
        // To try Tailwind CSS, uncomment the following code and comment out the above code:
      /*
      const App = () => {
        return (
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <h1 className="text-center">
              <p className="text-2xl font-bold text-blue-600">React JS</p>
              <p className="text-sm text-gray-500">powered by</p>
              <p className="text-sm font-semibold text-gray-700" id="target-element">SEA HORSE & TAILWIND CSS</p>
            </h1>
          </div>
        );
      };

      export default App;
      */
        `
      }
    },
  },
  nextjs: {
    tailwind: {
      command :'npm install -D tailwindcss postcss autoprefixer',
      templates: {
        'tailwind.config.js':`
            module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],`
      },
      overwrites:{
        'styles/globals.css':`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `,
      }
    },
  }
});