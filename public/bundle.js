/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nError: Cannot find module '@babel/preset-react'\nRequire stack:\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/files/plugins.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/files/index.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/index.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/babel-loader/lib/index.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/loader-runner/lib/loadLoader.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/loader-runner/lib/LoaderRunner.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack/lib/NormalModule.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack/lib/NormalModuleFactory.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack/lib/Compiler.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack/lib/webpack.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack-cli/bin/utils/validate-options.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack-cli/bin/utils/convert-argv.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack-cli/bin/cli.js\n- /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/webpack/bin/webpack.js\n    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:889:15)\n    at resolve (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/v8-compile-cache/v8-compile-cache.js:166:23)\n    at resolveStandardizedName (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/files/plugins.js:111:7)\n    at resolvePreset (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/files/plugins.js:59:10)\n    at loadPreset (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/files/plugins.js:78:20)\n    at loadPreset.next (<anonymous>)\n    at createDescriptor (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-descriptors.js:187:16)\n    at createDescriptor.next (<anonymous>)\n    at step (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/gensync/index.js:261:32)\n    at evaluateAsync (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/gensync/index.js:291:5)\n    at /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/gensync/index.js:44:11\n    at Array.forEach (<anonymous>)\n    at Function.async (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/gensync/index.js:43:15)\n    at Function.all (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/gensync/index.js:216:13)\n    at Generator.next (<anonymous>)\n    at createDescriptors (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-descriptors.js:142:41)\n    at createDescriptors.next (<anonymous>)\n    at createPresetDescriptors (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-descriptors.js:134:17)\n    at createPresetDescriptors.next (<anonymous>)\n    at presets (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-descriptors.js:73:26)\n    at presets.next (<anonymous>)\n    at mergeChainOpts (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-chain.js:420:34)\n    at mergeChainOpts.next (<anonymous>)\n    at /Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-chain.js:378:14\n    at Generator.next (<anonymous>)\n    at loadFileChain (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-chain.js:232:24)\n    at loadFileChain.next (<anonymous>)\n    at buildRootChain (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/config-chain.js:135:31)\n    at buildRootChain.next (<anonymous>)\n    at loadPrivatePartialConfig (/Users/kelsey/Desktop/Capstone/Tiger-Sugar-Capstone/node_modules/@babel/core/lib/config/partial.js:103:62)");

/***/ }),

/***/ 0:
/*!********************************************!*\
  !*** multi @babel/polyfill ./src/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/polyfill'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map