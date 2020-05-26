<p align="center">
  <a href="https://github.com/JensVanhulst/PXL-socket-programming" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://www.pxl.be/Assets/website/pxl_algemeen/afbeeldingen/grotere_versie/1314_logo_pxl_bol_witrand.png" alt="PXL Logo">
  </a>
</p>

<p align="center">
   <a href="https://opensource.org/licenses/MIT">
    <img alt="GitHub" src="https://img.shields.io/github/license/JensVanhulst/IOT-Dashboard?style=for-the-badge">
  </a>
  <a href="https://github.com/JensVanhulst/PXL_socket-programming/releases">
    <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/JensVanhulst/PXL-socket-programming?include_prereleases&style=for-the-badge">
  </a>
  <a href="https://github.com/JensVanhulst/PXL_socket-programming/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/JensVanhulst/PXL-socket-programming?style=for-the-badge">
  </a>

  <a href="https://github.com/JensVanhulst/PXL_socket-programming/graphs/contributors">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/JensVanhulst/PXL-socket-programming?style=for-the-badge" alt="Contributions">
  </a>

  <a href="#">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/JensVanhulst/PXL-socket-programming?style=for-the-badge" alt="Language">
  </a>
</p>



# Game_Lobby
This is a web-based ZeroMQ game lobby with chat functionality and 2 games. [TicTacToe & Connect4] 

## Table of Contents
- [Game_Lobby](#game_lobby)
  - [Table of Contents](#table-of-contents)
  - [- License](#ullilicenseliul)
  - [Getting Started](#getting-started)
  - [Installation & setup](#installation--setup)
  - [Installation for development](#installation-for-development)
    - [Clone](#clone)
    - [Setup](#setup)
    - [To run development server (client)](#to-run-development-server-client)
    - [To run development server (server)](#to-run-development-server-server)
    - [Build application (client)](#build-application-client)
  - [Installation](#installation)
  - [Documentation](#documentation)
  - [People](#people)
  - [Questions](#questions)
  - [Issues](#issues)
  - [License](#license)
---

## Getting Started

To get started follow the instructions below to work on the project or download the latest release.

## Installation & setup
If you want to contribute to this project, 
make sure you have the following tools installed on your system.

> Required tools

| Software name  | Version  | Link                                 |
|----------------|----------| ------------------------------------ |
| Nodejs         | v12.16.2 | https://nodejs.org/en/               |
| ZeroMQ.js      | v6.0.0   | https://github.com/zeromq/zeromq.js/ |
> Recommended tools

| Software name      | Version | Link                               |
|--------------------|---------| ---------------------------------- |
| Visual Studio Code | @latest | https://visualstudio.microsoft.com |
| MQTT Test tools    |         |                                    |
| GitHub Desktop     | @latest | https://desktop.github.com/        |

## Installation for development

### Clone

- Clone this repo to your local machine using `https://github.com/JensVanhulst/PXL-socket-programming.git`

### Setup

### To run development server (client)

> Change to directory

```sh
cd PXL-socket-programming
cd client
```
> Start local development environment

```sh
npm run electron:serve
```

This will start an electron window on `http://localhost:8081`


### To run development server (server)

> Change to server directory

```sh
cd PXL-socket-programming
cd server
```
> Start local development environment

```sh
npm run dev
```

This will start a local server instance on port `3000`

### Build application (client)

> On mac
```sh
npm run electron:build
```

> On windows

⚠️Please remove following code from `vue.config.js` ⚠️

```js 
pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'PXL-Socket-Programming',
        mac: {
          target: 'pkg',
        },

      },
    },
  },
```


```sh
npm run electron:build
```


## Installation 
  - Go to [Releases](https://github.com/JensVanhulst/PXL-socket-programming/releases) and pick your operating system package


## Documentation

To check out the docs, visit [Documentation](https://github.com/JensVanhulst/PXL-socket-programming/wiki).


## People

- **Jens Vanhulst** - _CONTRIBUTOR_ - [Jens Vanhulst](https://github.com/JensVanhulst)
- **Kasper Toetenel** - _CONTRIBUTOR_ - [Kasper Toetenel](https://github.com/SheldonPi1999)

## Questions

For questions and support please submit an issue.

## Issues

To create a new issue please follow the issue templates provided.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
