var jsnums = require('./js-numbers/js-numbers');

/**
 * A token is a value, and a boolean indicating whether or not it is "marked".
 * Marking is done for two different reasons.
 * (1) We're comparing two expressions and want to mark where they differ.
 * (2) We're looking at a single expression and want to mark the deepest
 *     subexpression.
 * @param {string|jsnumber} val
 * @param {boolean} marked
 */
var Token = function (val, marked) {
  this.val_ = val;
  this.marked_ = marked;

  // Store string representation of value. In most cases this is just a
  // non repeated portion. In the case of something like 1/9 there will be both
  // a non repeated portion "0." and a repeated portion "1" - i.e. 0.1111111...
  /** @type {string} */
  this.nonRepeated_ = null;
  /** @type {string} */
  this.repeated_ = null;
  this.setStringRepresentation_();
};
module.exports = Token;

Token.prototype.isParenthesis = function () {
  return this.val_ === '(' || this.val_ === ')';
};

/**
 * Add the given token to the parent element.
 * @param {HTMLElement} element Parent element to add to
 * @param {number} xPos X position to place element at
 * @param {string?} markClass Class name to use if token is marked
 * @returns {number} the length of the added text element
 */
Token.prototype.renderToParent = function (element, xPos, markClass) {
  var text, textLength;

  text = document.createElementNS(Blockly.SVG_NS, 'text');
  // text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space",
  //   "preserve");

  var tspan = document.createElementNS(Blockly.SVG_NS, 'tspan');
  tspan.textContent = this.nonRepeated_.replace(/ /g, '\u00A0\u00A0');
  text.appendChild(tspan);

  if (this.repeated_) {
    tspan = document.createElementNS(Blockly.SVG_NS, 'tspan');
    tspan.setAttribute('style', 'text-decoration: overline');
    tspan.textContent = this.repeated_.replace(/ /g, '\u00A0\u00A0');
    text.appendChild(tspan);
  }

  element.appendChild(text);
  textLength = text.getBoundingClientRect().width;

  text.setAttribute('x', xPos);
  if (this.marked_ && markClass) {
    text.setAttribute('class', markClass);
  }

  return textLength;
};

/**
 * Sets string representation of value.
 */
Token.prototype.setStringRepresentation_ = function () {
  if (!jsnums.isSchemeNumber(this.val_) || typeof(this.val_) === 'number') {
    this.nonRepeated_ = this.val_;
    return;
  }

  // at this point we know we have a jsnumber
  if (this.val_.isInteger()) {
    this.nonRepeated_ = this.val_.toFixnum().toString();
    return;
  }

  // Gives us three values: Number before decimal, non-repeating portion,
  // repeating portion. If we don't have the last bit, there's no repitition.
  var repeater = jsnums.toRepeatingDecimal(this.val_.numerator(),
    this.val_.denominator());
  if (!repeater[2] || repeater[2] === '0') {
    this.nonRepeated_ = this.val_.toFixnum().toString();
    return;
  }

  this.nonRepeated_ = repeater[0] + '.' + repeater[1];
  this.repeated_ = repeater[2];
};
