"use strict";
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ePub"] = factory();
	else
		root["ePub"] = factory();
})(self, () => {
return (self["webpackChunkePub"] = self["webpackChunkePub"] || []).push([["epubcfi.3939436625"],{},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["commons"], () => (__webpack_exec__("./test/epubcfi.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ __webpack_exports__ = __webpack_exports__["default"];
/******/ return __webpack_exports__;
/******/ }
]);
});
//# sourceMappingURL=epubcfi.3939436625.js.map