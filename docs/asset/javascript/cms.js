/******/ var __webpack_modules__ = ({

/***/ "../exception/src/Exception.js":
/*!*************************************!*\
  !*** ../exception/src/Exception.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Exception)
/* harmony export */ });

class Exception extends Error {
    #origin = null;

    get origin(){ return this.#origin; }

    constructor(message = '', origin = null) {
        super(message);

        this.#origin = origin;
    }
}


/***/ }),

/***/ "../exception/src/exception/Invalid.js":
/*!*********************************************!*\
  !*** ../exception/src/exception/Invalid.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExceptionInvalid)
/* harmony export */ });
/* harmony import */ var _Exception_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Exception.js */ "../exception/src/Exception.js");


class ExceptionInvalid extends _Exception_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(message = '', origin = null) {
        super(message, origin);
    }
}


/***/ }),

/***/ "../exception/src/exception/invalid/Input.js":
/*!***************************************************!*\
  !*** ../exception/src/exception/invalid/Input.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExceptionInvalidInput)
/* harmony export */ });
/* harmony import */ var _Invalid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Invalid.js */ "../exception/src/exception/Invalid.js");


class ExceptionInvalidInput extends _Invalid_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(message = '', origin = null) {
        super(message, origin);
    }
}


/***/ }),

/***/ "./src/Bootstrap.js":
/*!**************************!*\
  !*** ./src/Bootstrap.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Bootstrap)
/* harmony export */ });
/* harmony import */ var _bootstrap_Input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap/Input.js */ "./src/bootstrap/Input.js");


class Bootstrap {
    static #input = _bootstrap_Input_js__WEBPACK_IMPORTED_MODULE_0__["default"];

    static get input(){ return Bootstrap.#input; }
}

/***/ }),

/***/ "./src/ContentManagementSystem.js":
/*!****************************************!*\
  !*** ./src/ContentManagementSystem.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentManagementSystem)
/* harmony export */ });


class ContentManagementSystem {
    static subscribe(email) {
        console.log(email);
    }
}

/***/ }),

/***/ "./src/ProjectedBy.js":
/*!****************************!*\
  !*** ./src/ProjectedBy.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProjectedBy)
/* harmony export */ });
/* harmony import */ var _Bootstrap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bootstrap.js */ "./src/Bootstrap.js");
/* harmony import */ var _ContentManagementSystem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContentManagementSystem.js */ "./src/ContentManagementSystem.js");



class ProjectedBy {
    static #bootstrap = _Bootstrap_js__WEBPACK_IMPORTED_MODULE_0__["default"];
    static #cms = _ContentManagementSystem_js__WEBPACK_IMPORTED_MODULE_1__["default"];

    static get bootstrap(){ return ProjectedBy.#bootstrap; }

    static get cms(){ return ProjectedBy.#cms; }
}


/***/ }),

/***/ "./src/bootstrap/Input.js":
/*!********************************!*\
  !*** ./src/bootstrap/Input.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BootstrapInput)
/* harmony export */ });
/* harmony import */ var _exception_src_exception_invalid_Input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../exception/src/exception/invalid/Input.js */ "../exception/src/exception/invalid/Input.js");


class BootstrapInput {
    static on(o) {
        o.addEventListener('change', event => {
            if(o.classList.contains('is-invalid')) o.classList.remove('is-invalid');
        });

        o.addEventListener('keydown', event => {
            if(o.classList.contains('is-invalid')) o.classList.remove('is-invalid');
        });
    }

    static validate(o) {
        if(o.validity.valid) return true;

        if(!o.classList.contains('is-invalid')) o.classList.add('is-invalid');
        o.focus();

        throw new _exception_src_exception_invalid_Input_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    }
}

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProjectedBy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProjectedBy.js */ "./src/ProjectedBy.js");


if(!window.projectedby) {
    window.projectedby = _ProjectedBy_js__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_ProjectedBy_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=cms.js.map