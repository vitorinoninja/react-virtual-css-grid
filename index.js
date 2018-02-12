module.exports =
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



var utilities = {};

utilities.getElementFontSize = function(element) {
  return typeof getComputedStyle !== 'undefined'
    ? parseFloat(getComputedStyle(element, '').fontSize)
    : 16; // Default browser font-size
};

utilities.getCreatedElementDimensions = function(parent, properties, content) {
  var element = document.createElement('div');
  var style = element.style;
  var dimensions;
  var property;

  style.position = 'absolute';
  style.zIndex = -2147483648;
  style.left = 0;
  style.top = 0;
  style.visibility = 'hidden';

  if (properties) {
    for (property in properties) {
      /* istanbul ignore else */
      if (properties.hasOwnProperty(property)) {
        style[property] = properties[property];
      }
    }
  }

  if (content) {
    element.innerHTML = content;
  }

  parent.appendChild(element);

  dimensions = [
    element.offsetWidth,
    element.offsetHeight
  ];

  parent.removeChild(element);

  return dimensions;
};

utilities.getCreatedElementWidth = function(parent, properties, content) {
  return utilities.getCreatedElementDimensions(parent, properties, content)[0];
};

utilities.getCreatedElementHeight = function(parent, properties, content) {
  return utilities.getCreatedElementDimensions(parent, properties, content)[1];
};

var selfReferenceTriggers = [
  'perspective',
  'translate',
  'translate3d',
  'translateX',
  'translateY',
  'translateZ',
  'transformOrigin'
];

var layoutYTriggers = [
  'height',
  'top',
  'translateY'
];

var positionTriggers = ['absolute', 'fixed'];

utilities.getRelativeElementDimension = function(element, property) {
  var reference;
  var dimension;
  var referenceComputed;
  var useY = layoutYTriggers.indexOf(property) > -1;
  var useSelf = selfReferenceTriggers.indexOf(property) > -1;
  var positioned = positionTriggers.indexOf(getComputedStyle(element, '').position) > -1;

  if (useSelf) {
    reference = element;
  } else {
    reference = positioned
      ? element.offsetParent
      : element.parentNode;
  }

  dimension = useY
    ? reference.offsetHeight
    : reference.offsetWidth;

  if (!useSelf && positioned) {
    referenceComputed = getComputedStyle(reference, '');

    dimension -= useY
      ? parseFloat(referenceComputed.paddingTop) + parseFloat(referenceComputed.paddingBottom)
      : parseFloat(referenceComputed.paddingRight) + parseFloat(referenceComputed.paddingLeft);
  }

  return dimension;
};

utilities.DPI = (function () {
  // Preserve dpi-reliant conversion functionality when not running in browser environment
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return 96;
  }

  return utilities.getCreatedElementWidth(document.body, {
    'width': '1in'
  });
}());

/**
 * Return value if non-zero, else return one (to avoid division by zero in calling code).
 *
 * @param {number} value Number to return, converting to one if zero.
 * @returns {number} Non-zero value.
 */
utilities.ifZeroThenOne = function(value) {
  return value === 0
    ? 1
    : value;
};

// Exports
module.exports = utilities;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _unitsCss = __webpack_require__(3);

var _unitsCss2 = _interopRequireDefault(_unitsCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualCSSGrid = function (_React$Component) {
  _inherits(VirtualCSSGrid, _React$Component);

  function VirtualCSSGrid(props) {
    _classCallCheck(this, VirtualCSSGrid);

    // the renderGridItem function is required
    var _this = _possibleConstructorReturn(this, (VirtualCSSGrid.__proto__ || Object.getPrototypeOf(VirtualCSSGrid)).call(this, props));

    _initialiseProps.call(_this);

    if (!props.renderGridItem) throw new Error("A CSSGrid item renderer is required (renderGridItem prop)");
    // the renderGridItem function is required
    if (!props.nItems) throw new Error("The total ammount of items to render is required (nItems prop)");

    // other defaults and props overrides

    var _props$nItems = props.nItems,
        nItems = _props$nItems === undefined ? 0 : _props$nItems,
        _props$nColumns = props.nColumns,
        nColumns = _props$nColumns === undefined ? 5 : _props$nColumns,
        _props$columnWidth = props.columnWidth,
        columnWidth = _props$columnWidth === undefined ? "1fr" : _props$columnWidth,
        _props$rowHeight = props.rowHeight,
        rowHeight = _props$rowHeight === undefined ? 100 : _props$rowHeight,
        renderGridItem = props.renderGridItem,
        gridStyleFromProps = props.gridStyle,
        styleFromProps = props.style,
        divProps = _objectWithoutProperties(props, ['nItems', 'nColumns', 'columnWidth', 'rowHeight', 'renderGridItem', 'gridStyle', 'style']);

    // the cointainer style


    var style = _extends({
      overflow: 'auto',
      // totally arbitrary first height value
      height: '100px'
    }, styleFromProps);

    //  the gridStyle
    var gridStyle = _extends({
      display: "grid",
      overflow: "hidden"
    }, gridStyleFromProps);

    // resolving the gap values

    var _this$resolveGap = _this.resolveGap(gridStyle.gridGap),
        rowsGap = _this$resolveGap.rowsGap,
        columnsGap = _this$resolveGap.columnsGap;

    _this.state = {
      style: style,
      gridStyle: gridStyle,
      nItems: nItems,
      nColumns: nColumns,
      columnWidth: columnWidth,
      rowHeight: rowHeight,
      content: [],
      rowPosition: 0,
      renderGridItem: renderGridItem,
      divProps: divProps,
      rowsGap: rowsGap,
      columnsGap: columnsGap
    };

    return _this;
  }

  // resolving the gap value


  _createClass(VirtualCSSGrid, [{
    key: 'resolveGap',
    value: function resolveGap(gapCSSString) {
      // default gaps (0 pixels)
      var defaultGaps = {
        rowsGap: 0,
        columnsGap: 0
      };
      if (!gapCSSString) return defaultGaps;
      // converting abitrary gap values to pixels
      return _extends({}, defaultGaps, gapCSSString.split(/\s+/).reduce(function (obj, item, index) {
        // getting current gap (first row, then column, then ignore any extra)
        var gap = _unitsCss2.default.convert("px", item);
        //  setting both row and column gap to the first value found
        if (index == 0) return { rowsGap: gap, columnsGap: gap
          //  setting the column gap to the second value found
        };if (index == 1) return _extends({}, obj, { columnsGap: gap
          //  any other value is ignored
        });return obj;
      }, {}));
    }

    //  receives the scrollTop and offsetHeight
    //  and provides the numbers we need to render
    //  just the necessary items
    //  scrollTop is typically the scroll event target scrollTop value
    //  containerHeight is typically the scroll event target offsetHeight value (the actual box height of it)


    // handles the React onScroll event

  }, {
    key: 'componentDidMount',


    // renders the first time as soon as we can calculate the dimensions
    value: function componentDidMount() {
      this.calculateContentPosition(0, this.container.offsetHeight);
    }

    // the actual react component render method

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        _extends({}, this.state.divProps, {
          ref: function ref(element) {
            return _this2.container = element;
          },
          style: this.state.style,
          onScroll: this.handleScroll }),
        _react2.default.createElement(
          'div',
          {
            ref: function ref(grid) {
              return _this2.grid = grid;
            },
            style: this.state.gridStyle },
          this.state.content
        )
      );
    }
  }]);

  return VirtualCSSGrid;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.calculateContentPosition = function (scrollTop, containerHeight) {
    //  the real nColumns depends of the grid`s css and dimension
    var nColumns = 0;
    //  support for the "auto-fill" cssGrid feature considering
    //  the DOM Engine is filling as much content as it can in one row
    if (/repeat\(\s*auto\-fill/.test(_this3.grid.style.gridTemplateColumns)) {
      //  maximum grid width that can be filled per row
      var maximunWidth = _this3.grid.offsetWidth;
      //  checking how many gridItems are filling a row
      //  and using this as basis for our nColumns
      Array.from(_this3.grid.children).some(function (item) {
        //  if the next gridItem need more space then available, nColumns is defined
        if ((maximunWidth -= item.offsetWidth) < 0) return true;
        //  otherwise we can add more columns
        nColumns++;
        return false;
      });
    } else {
      //  if the content isn't filling the ammount of columns, we might use
      //  this super fast "hack"s to calculate it before the next render
      //  we start by getting columns specified outside css functions
      //  ie: "[linename1] 100px [linename2] repeat(auto-fit, [linename3 linename4] 300px) 100px"
      //  100px and 100px are 2 columns specified outside css functions
      var columnsOutsideFunctions = _this3.grid.style.gridTemplateColumns.replace(/\S*\(.*?\)|\[.*?\]/g, "").trim().split(/\s+/);
      //  if no auto-fitting is specified, use the columnsOutsideFunctions length
      nColumns = columnsOutsideFunctions.length;
      //  otherwise, calculate how many auto fitted gridItems there will be
      if (_this3.grid.style.gridTemplateColumns.indexOf("auto-fit") !== -1) {
        //  if the ammout of columns is generated using the gridItems size
        //  check how many are necessary to fill one row and use that
        //  as base to calculate the rest of the grid
        //  when auto-fits are present, we can't currently (2018-02-10) use it
        //  with relative units, like fr or %. It must be absolute like px.
        //  so let's calculate how much space the columns outside functions use
        //  to stabilish how much auto-fit room we got remaining
        //  little neat trick starting the reduce at "rowsGap * -1" allows us to
        //  add the rowGap for every new auto fitted item, even if its the first column
        var columnsOutsideFunctionsWidth = columnsOutsideFunctions.reduce(function (width, column) {
          return width + _unitsCss2.default.convert("px", column) + _this3.state.rowsGap;
        }, _this3.state.rowsGap * -1);
        //  grabbing the auto-fit necessary width per repeat item
        //  ie: repeat(auto-fit, 100px) = 100px necessary per new item (plus grid gap)
        var autoFitSize = _this3.state.rowsGap + _unitsCss2.default.convert("px", _this3.grid.style.gridTemplateColumns.match(/\(.*auto-fit.*?(\d+\w+).*\)/)[1]);
        //  finally stabilishing how many auto-fit gridItems we are rendering per column
        var nAutoFittedColumns = Math.floor((_this3.grid.offsetWidth - columnsOutsideFunctionsWidth) / autoFitSize);
        //  nColumns can be finally calculated sums autofitted and regular gridItems
        nColumns = nAutoFittedColumns + nColumns;
      }
    }

    // if by any means we still got 0 nColumns, use the initial state value
    nColumns || (nColumns = _this3.state.nColumns);

    //  how many rows are we talking about?
    var nRows = Math.ceil(_this3.state.nItems / nColumns);
    //  calculated height of the grid
    var gridHeight = nRows * _this3.state.rowHeight + _this3.state.rowsGap * (nRows - 1);
    //  we might roll just enough to see an extra row
    var nRowsToShow = Math.ceil(containerHeight / _this3.state.rowHeight) + 1;
    //  here we calculate how many items we will render
    var nItensToRender = nRowsToShow * nColumns;
    //  the abolute position considering an one dimension list/array
    var position = Math.floor(_this3.state.nItems * scrollTop / gridHeight) || 0;
    //  we must ajust the position to always fill from the first grid cell
    //  even if the scroll position "points" to an item in the middle of a line
    var firstItemToShow = position - position % nColumns;
    //  getting the rowPosition now that we stabished the absolutePosition
    var rowPosition = Math.floor(firstItemToShow / nColumns);
    //  ;)
    var content = [].concat(_toConsumableArray(Array(nItensToRender).keys())).map(function (i) {
      return i + firstItemToShow;
    }).filter(function (i) {
      return i < _this3.state.nItems;
    }).map(function (absolutePosition, counter) {
      var columnPosition = absolutePosition % nColumns;
      var rowPosition = Math.floor(counter / nColumns);
      var gridItem = _this3.state.renderGridItem({ absolutePosition: absolutePosition, columnPosition: columnPosition, rowPosition: rowPosition });
      var styledGridItem = _extends({}, gridItem, {
        style: _extends({}, gridItem.style, {
          gridRowStart: rowPosition + 1,
          gridColumnStart: columnPosition + 1
        })
      });
      return styledGridItem;
    });

    // The Grid Style
    var marginTop = rowPosition * _this3.state.rowHeight + _this3.state.rowsGap * rowPosition;
    var gridTemplateColumns = _this3.state.gridStyle.gridTemplateColumns || 'repeat(' + nColumns + ', ' + _this3.state.columnWidth + ')';
    var gridStyle = _extends({}, _this3.state.gridStyle, {
      display: "grid",
      height: gridHeight - marginTop + 'px',
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateRows: 'repeat(' + nRowsToShow + ', ' + _this3.state.rowHeight + 'px)',
      overflow: "hidden",
      //gridGap:"10px",
      marginTop: marginTop

      // sets the state (and that calls the render function again)
    });_this3.setState({
      content: content,
      scrollTop: scrollTop,
      nRowsToShow: nRowsToShow,
      rowPosition: rowPosition,
      gridStyle: gridStyle,
      nColumns: nColumns
    });
  };

  this.handleScroll = function (_ref) {
    var _ref$target = _ref.target,
        scrollTop = _ref$target.scrollTop,
        offsetHeight = _ref$target.offsetHeight;

    _this3.calculateContentPosition(scrollTop, offsetHeight);
  };
};

exports.default = VirtualCSSGrid;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



// Imports
var conversions = __webpack_require__(5);
var isNumeric = __webpack_require__(10);

var units = {};


// Expose conversion functions
//------------------------------------------------------------------------------

units.conversions = conversions;


// Properties with non default unit/value
//------------------------------------------------------------------------------

var properties = units.properties = {};

properties.lineHeight =
properties.opacity =
properties.scale =
properties.scale3d =
properties.scaleX =
properties.scaleY =
properties.scaleZ = {
  'defaultUnit': '',
  'defaultValue': 1
};

properties.rotate =
properties.rotate3d =
properties.rotateX =
properties.rotateY =
properties.rotateZ =
properties.skew =
properties.skewX =
properties.skewY = {
  'defaultUnit': 'deg'
};

properties.resolution = {
  'defaultUnit': 'dpi',
  'defaultValue': 96
};


// Public interface
//------------------------------------------------------------------------------

units.convert = function(to, value, element, property) {
  var parts = units.parse(value, property);

  if (to === '_default') {
    to = units.getDefaultUnit(property);
  }

  return to === parts.unit
    ? parts.value
    : units.processConversion(parts.unit, to, parts.value, element, property);
};

units.parse = function(value, property) {
  var parts = {};
  var matches;

  if (isNumeric(value)) {
    parts.value = value;
    parts.unit = property
      ? units.getDefaultUnit(property)
      : '';
  } else {
    matches = value.toString().trim().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);

    if (matches !== null) {
      parts.value = matches[1];
      parts.unit = matches[2];
    } else {
      parts.unit = value;
      parts.value = property
        ? units.getDefaultValue(property)
        : 0;
    }
  }

  parts.value = parseFloat(parts.value);

  return parts;
};

units.getDefaultValue = function(property) {
  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultValue !== 'undefined'
    ? properties[property].defaultValue
    : 0;
};

units.getDefaultUnit = function(property) {
  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultUnit !== 'undefined'
    ? properties[property].defaultUnit
    : 'px';
};


// Protected methods
//------------------------------------------------------------------------------

units.processConversion = function(fromUnits, toUnits, value, element, property) {
  var type = units.getConversionType(fromUnits);
  var method;

  if (typeof type[fromUnits][toUnits] === 'function') {
    method = type[fromUnits][toUnits];
  } else {
    method = type[type._default][toUnits];
    value = type[fromUnits][type._default](value, element, property); // Use default unit conversion as an interstitial step
  }

  return method(value, element, property);
};

units.getConversionType = function(fromUnits) {
  var property;
  var type = null;

  for (property in conversions) {
    /* istanbul ignore else */
    if (conversions.hasOwnProperty(property) && typeof conversions[property][fromUnits] !== 'undefined') {
      type = conversions[property];
      break;
    }
  }

  return type;
};

// Exports
module.exports = units;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



// Exports
module.exports = {
  'angle': __webpack_require__(6),
  'length': __webpack_require__(7),
  'resolution': __webpack_require__(9)
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



var angle = {'_default': 'deg'};

// Supported units:
// deg, grad, rad, turn

angle.deg = {
  'grad': function(value) {
    return value / 0.9;
  },

  'rad': function(value) {
    return value * (Math.PI / 180);
  },

  'turn': function(value) {
    return value / 360;
  }
};

angle.grad = {
  'deg': function(value) {
    return value * 0.9;
  }
};

angle.rad = {
  'deg': function(value) {
    return value / (Math.PI / 180);
  }
};

angle.turn = {
  'deg': function(value) {
    return value * 360;
  }
};

// Exports
module.exports = angle;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



// Imports
var utilities = __webpack_require__(0);
var viewport = __webpack_require__(8);

var length = {'_default': 'px'};

// Supported units:
// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw

length[''] = {
  'px': function(value, element) {
    return parseFloat(getComputedStyle(element, '').fontSize) * value;
  }
};

length['%'] = {
  'px': function(value, element, property) {
    return (value * utilities.getRelativeElementDimension(element, property)) / 100;
  }
};

length.ch = {
  'px': function(value, element) {
    return value * utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
  }
};

length.cm = {
  'px': function(value) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI);
  }
};

length.em = {
  'px': function(value, element) {
    return value * utilities.getElementFontSize(element);
  }
};

length.ex = {
  'px': function(value, element) {
    return value * utilities.getCreatedElementHeight(element, null, 'x');
  }
};

length['in'] = {
  'px': function(value) {
    return value * utilities.DPI;
  }
};

length.mm = {
  'px': function(value) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI) / 10;
  }
};

length.pc = {
  'px': function(value) {
    return value * ((utilities.DPI / 72) * 12);
  }
};

length.pt = {
  'px': function(value) {
    return value * utilities.DPI / 72;
  }
};

length.px = {
  '': function(value, element) {
    return value / parseFloat(getComputedStyle(element, '').fontSize);
  },

  '%': function(value, element, property) {
    return (value / utilities.ifZeroThenOne(utilities.getRelativeElementDimension(element, property))) * 100;
  },

  'ch': function(value, element) {
    return value / utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
  },

  'cm': function(value) {
    return value / utilities.ifZeroThenOne(utilities.DPI) * 2.54;
  },

  'em': function(value, element) {
    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(element));
  },

  'ex': function(value, element) {
    return value / utilities.ifZeroThenOne(utilities.getCreatedElementHeight(element, null, 'x'));
  },

  'in': function(value) {
    return value / utilities.ifZeroThenOne(utilities.DPI);
  },

  'mm': function(value) {
    return value * 2.54 / utilities.ifZeroThenOne(utilities.DPI) * 10;
  },

  'pc': function(value) {
    return value / ((utilities.DPI / 72) * 12);
  },

  'pt': function(value) {
    return value * 72 / utilities.DPI;
  },

  'rem': function(value) {
    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(document.documentElement));
  },

  'vh': function(value) {
    return value / utilities.ifZeroThenOne((viewport.height() / 100));
  },

  'vmax': function(value) {
    return value / utilities.ifZeroThenOne((viewport.max() / 100));
  },

  'vmin': function(value) {
    return value / utilities.ifZeroThenOne((viewport.min() / 100));
  },

  'vw': function(value) {
    return value / utilities.ifZeroThenOne((viewport.width() / 100));
  }
};

length.rem = {
  'px': function(value) {
    return value * utilities.getElementFontSize(document.documentElement);
  }
};

length.vh = {
  'px': function(value) {
    return value * (viewport.height() / 100);
  }
};

length.vmax = {
  'px': function(value) {
    return value * (viewport.max() / 100);
  }
};

length.vmin = {
  'px': function(value) {
    return value * (viewport.min() / 100);
  }
};

length.vw = {
  'px': function(value) {
    return value * (viewport.width() / 100);
  }
};

// Exports
module.exports = length;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



var viewport = {};
var width = -1;
var height = -1;


// Public interface
//------------------------------------------------------------------------------

/**
 * Get browser viewport width.
 *
 * @returns {number} Internal reference to browser viewport width.
 */
viewport.width = function() {
  return width;
};

/**
 * Get browser viewport height.
 *
 * @returns {number} Internal reference to browser viewport height.
 */
viewport.height = function() {
  return height;
};

/**
 * Get maximum browser viewport dimension (width or height).
 *
 * @returns {number} Internal reference to maximum browser viewport dimension.
 */
viewport.max = function() {
  return Math.max(width, height);
};

/**
 * Get minimum browser viewport dimension (width or height).
 *
 * @returns {number} Internal reference to minimum browser viewport dimension.
 */
viewport.min = function() {
  return Math.min(width, height);
};


/**
 * Set internal dimension references to current browser viewport width and height.
 * Called by viewport#onWindowResize on resize and orientationchange.
 */
viewport.setDimensions = function() {
  /* istanbul ignore else */
  if (typeof document !== 'undefined') {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
  }
};


// Protected methods
//------------------------------------------------------------------------------

/**
 * Handler for window resize and orientationchange events. Calls viewport#setDimensions.
 *
 * @private
 */
viewport.onWindowResize = function() {
  viewport.setDimensions();
};

/* istanbul ignore else */
if (typeof window !== 'undefined') {
  window.addEventListener('resize', viewport.onWindowResize, false);
  window.addEventListener('orientationchange', viewport.onWindowResize, false);

  viewport.setDimensions();
}

// Exports
module.exports = viewport;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser, node */



// Imports
var utilities = __webpack_require__(0);

var resolution = {'_default': 'dpi'};

// Supported units:
// dpi, dpcm, dppx

resolution.dpi = {
  'dpcm': function(value) {
    return value / 2.54;
  },

  'dppx': function(value) {
    return value / utilities.DPI;
  }
};

resolution.dpcm = {
  'dpi': function(value) {
    return value * 2.54;
  }
};

resolution.dppx = {
  'dpi': function(value) {
    return value * utilities.DPI;
  }
};

// Exports
module.exports = resolution;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var isNumeric = function (obj) {
    obj = typeof(obj) === "string" ? obj.replace(/,/g, "") : obj;
    return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== "[object array]";
};

if (true) {
    if (typeof (module) !== "undefined" && module.exports) {
        exports = module.exports = isNumeric;
    }
    exports.isNumeric = isNumeric;
}


/***/ })
/******/ ]);