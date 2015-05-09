# Angular bootstrap confirm
[![Build Status](https://travis-ci.org/mattlewis92/angular-bootstrap-confirm.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-bootstrap-confirm)
[![Bower version](https://badge.fury.io/bo/angular-bootstrap-confirm.svg)](http://badge.fury.io/bo/angular-bootstrap-confirm)
[![devDependency Status](https://david-dm.org/mattlewis92/angular-bootstrap-confirm/dev-status.svg)](https://david-dm.org/mattlewis92/angular-bootstrap-confirm#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/f00fe7fdcfa04a38a31750bec12e142d)](https://www.codacy.com/app/matt-lewis-private/angular-bootstrap-confirm)

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Demo](#demo)
- [Development](#development)
- [License](#licence)

## About

A simple angular directive to display a bootstrap styled confirmation popover when an element is clicked.

Pull requests are welcome.

## Installation

The calendar has a few dependencies, these are as follows, and must be included BEFORE the plugin files:

* [AngularJS](https://angularjs.org/) 1.3+
* [Bootstrap](http://getbootstrap.com/) 3+ (CSS only)
* [Angular off click](https://github.com/TheSharpieOne/angular-off-click)
* [ui-bootstrap](http://angular-ui.github.io/bootstrap/) (Only the $position service is required. If you don't want to include the entire ui-bootstrap library the position service is included as a standalone file in this repo in src/ui-bootstrap-position.js)

It is recommended that you install the plugin and its dependencies through bower:

```
bower install --save angular-bootstrap-confirm
```

You will then need to include the JS and CSS files for the plugin:

```
<script src="bower_components/angular-bootstrap-confirm/dist/angular-bootstrap-confirm.min.js">
```

And finally add the module dependency in your AngularJS app:

```javascript
angular.module('myModule', ['mwl.confirm']);
```

## Documentation

### mwl-confirm directive

There is a single directive exposed to create the confirmation popover, use it like so:
```javascript
<button
  class="btn btn-default"
  mwl-confirm
  title="{{ title }}"
  message="{{ message }}"
  confirm-text="{{ confirmText }}"
  cancel-text="{{ cancelText }}"
  placement="{{ placement }}"
  on-confirm="confirmClicked = true"
  on-cancel="cancelClicked = true"
  confirm-button-type="danger"
  cancel-button-type="default">
  Click me!
</button>
```

An explanation of the properties is as follows:

#### title
The title of the popover. This value is interpolated.

#### message
The body text of the popover. This value is interpolated.

#### confirm-text
The text of the confirm button. This value is interpolated. Default "Confirm"

#### cancel-text
The text of the cancel button. This value is interpolated. Default "Cancel"

#### placement
The placement of the popover. This value is interpolated. It can be either "top", "right", "bottom" or "left". Default "top"

#### on-confirm
An angular expression that is called when the confirm button is clicked.

#### on-cancel
An angular expression that is called when the cancel button is clicked.

#### confirm-button-type
The bootstrap button type of the confirm button. This value is interpolated. It can be any supported bootstrap color type e.g. default, warning, danger etc. Default "success"

#### cancel-button-type
The bootstrap button type of the cancel button. This value is interpolated. It can be any supported bootstrap color type e.g. default, warning, danger etc. Default "default"

### confirmationPopover provider
There is also a provider you can use to configure the directive defaults. The following chainable methods are exposed:
```javascript
angular.module('myModule').config(function(confirmationPopoverProvider) {
  confirmationPopoverProvider
    .setDefaultConfirmText('Confirm')
    .setDefaultCancelText('Cancel')
    .setDefaultConfirmButtonType('success')
    .setDefaultCancelButtonType('default')
    .setDefaultPlacement('top');
});
```

There is also a provider so you can configure all the directive defaults. 

## Demo

http://mattlewis92.github.io/angular-bootstrap-confirm/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g gulp`
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `gulp watch` to start a development server on port 8000 with livereload. 

### Testing
Run `gulp test:src` to run tests once or `test:watch` to continually run tests (this is automatic when you run `gulp watch`). 

### Build
Run `gulp build` to build the project files in the dist folder

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
