# Installation
1. copy all files in your project folder
2. run `npm install` to install 
3. if you have Webstorm there should be buttons beside the tests, to run individual tests. if you have VS Code just type `jest` into the console to run all test  
For more information visit (jest website)[https://jestjs.io/docs/getting-started]

# Manual instalation
1. install jest and ts-jest `npm i --save-dev jest ts-test @types/jest`
2. add `"test":"jest"` to the scripts section of your `package.json`
3. create jestconfig to `npx ts-jest config:init` 
4. copy the test files in the `test` folder in the project
5. run the tests with `npm test`