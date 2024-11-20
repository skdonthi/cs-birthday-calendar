# CS - Birthday Calendar

This is a Single Page Web Application built with Angular to organize friends' birthdays.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.5.

## Prerequisites

- Node.js (latest version), Used: v20.9.0
- npm (latest version), Used: v10.9.0
- Angular CLI (latest version), Used: v18.2.5

## Installation

1. Clone the repository and navigate to this project's root folder
2. Run `npm install` to install dependencies

## Running the application

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running tests

Run `ng test` to execute the unit tests via Karma.

I used Firefox as my default testing browser because I don't use Chrome (I use Brave). If you want to run tests in Chrome then run `ng test --browsers=Chrome`.
or use Headless versions `ng test --browsers=ChromeHeadless` or `ng test --browsers=FirefoxHeadless`

**Note**: Make sure you install the Firefox or Chrome and add the required environment variable

**for macOS**: I got below error since I do not have Chrome

        Can not find the binary /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
        Please set env variable CHROME_BIN

## Building for production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Browser Support

This application supports the newest versions of Chrome, Firefox, and Safari on macOS and Windows computers.
