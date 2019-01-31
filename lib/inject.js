'use strict';

// const TRAPS = [
//   'getPrototypeOf',
//   'setPrototypeOf',
//   'isExtensible',
//   'preventExtensions',
//   'getOwnPropertyDescriptor',
//   'defineProperty',
//   'has',
//   'get',
//   'set',
//   'deleteProperty',
//   'ownKeys',
//   'apply',
//   'construct'
// ];

const util = require('util');
const DEPENDENCIES = require('./dependencies');
const CACHE = {};
const TARGET = Object.freeze({});

function inject(fn) {
  
  const body = parse(fn);

  if (body.type == 'FunctionExpression') {

    const deps = parseDependencies(body.params);
    return (deps.length) ? createdInjectedFn(fn, deps) : fn;

  }

  if (body.type == 'ClassExpression') {

    for (const method of body.body.body) {

      if (['constructor', 'get', 'set'].includes(method.kind)) {
        continue;
      }

      const deps = parseDependencies(method.value.params);

      if (!deps.length) {
        continue;
      }
      
      if (method.static) {
        fn[method.key.name] = createdInjectedFn(fn[method.key.name], deps);
      } else {
        fn.prototype[method.key.name] = createdInjectedFn(fn.prototype[method.key.name], deps);
      }

    }

    return fn;

  }

  throw new Error('Must be a function or class');

}

function parse(fn) {
  const esprima = require('esprima');
  const source = '(' + fn.toString().replace(/\basync\b|\bawait\b/g, '') + ')';
  return esprima.parse(source).body[0].expression;
}

function parseDependencies(params) {
  
  const deps = [];
  
  if (!params.length || params[0].type != 'ArrayPattern') {
    return deps;
  }

  for (const element of params[0].elements) {
    if (element.name.startsWith('$')) {
      deps.push(element.name.slice(1));
    }
  }

  if (deps.length && deps.length != params[0].elements.length) {
    throw new Error(`Unprefixed dependency name in ${params[0]}`);
  }

  return deps;
}

function createdInjectedFn(fn, deps) {

  const proxies = [];

  for (const dep of deps) {

    const handler = {

      has: (target, property) => {
        return property in CACHE[dep];
      },

      get: (target, property, receiver) => {
        if (property == util.inspect.custom) {
          return () => CACHE[dep];
        }
        return CACHE[dep][property];
      },

      set: (target, property, value, receiver) => {
        CACHE[dep][property] = value;
        return true;
      }

    };

    proxies.push(new Proxy(TARGET, handler));

  }

  // return eval(`(function ${fn.name}() {
  //   return fn.call(this, proxies, ...arguments);
  // })`);
  
  return function injectionWrapper() {
    return fn.call(this, proxies, ...arguments);
  };

}

inject.reset = function reset(key) {
  CACHE[key] = DEPENDENCIES[key]();
};

inject.ready = function ready() {
  for (const key in DEPENDENCIES) {
    if (DEPENDENCIES.hasOwnProperty(key)) {
      inject.reset(key);
    }
  }
};

module.exports = inject;
