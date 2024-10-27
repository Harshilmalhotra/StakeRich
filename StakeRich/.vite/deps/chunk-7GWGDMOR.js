import {
  BaseError,
  ChainDoesNotSupportContract,
  ClientChainNotConfiguredError,
  ExecutionRevertedError,
  FeeCapTooHighError,
  FeeCapTooLowError,
  FeeConflictError,
  InsufficientFundsError,
  IntrinsicGasTooHighError,
  IntrinsicGasTooLowError,
  InvalidAddressError,
  InvalidBytesBooleanError,
  InvalidBytesLengthError,
  NonceMaxValueError,
  NonceTooHighError,
  NonceTooLowError,
  TipAboveFeeCapError,
  TransactionTypeNotSupportedError,
  UnknownNodeError,
  assertSize,
  boolToHex,
  bytesToHex,
  checksumAddress,
  concat,
  concatHex,
  createCursor,
  formatEther,
  formatGwei,
  formatTransactionRequest,
  getChainContractAddress,
  getContractAddress,
  getUrl,
  hexToBigInt,
  hexToBytes,
  hexToNumber,
  isAddress,
  isHex,
  keccak256,
  numberToHex,
  padHex,
  prettyPrint,
  size,
  slice,
  sliceBytes,
  stringToHex,
  toBytes,
  trim
} from "./chunk-PSDWFF4R.js";

// node_modules/abitype/dist/esm/version.js
var version = "1.0.5";

// node_modules/abitype/dist/esm/errors.js
var BaseError2 = class _BaseError extends Error {
  constructor(shortMessage, args = {}) {
    var _a;
    const details = args.cause instanceof _BaseError ? args.cause.details : ((_a = args.cause) == null ? void 0 : _a.message) ? args.cause.message : args.details;
    const docsPath4 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
    const message = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsPath4 ? [`Docs: https://abitype.dev${docsPath4}`] : [],
      ...details ? [`Details: ${details}`] : [],
      `Version: abitype@${version}`
    ].join("\n");
    super(message);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiTypeError"
    });
    if (args.cause)
      this.cause = args.cause;
    this.details = details;
    this.docsPath = docsPath4;
    this.metaMessages = args.metaMessages;
    this.shortMessage = shortMessage;
  }
};

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match == null ? void 0 : match.groups;
}
var bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var isTupleRegex = /^\(.+?\).*?$/;

// node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
var tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${(result == null ? void 0 : result.array) ?? ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}

// node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1)
      params += ", ";
  }
  return params;
}

// node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return "fallback()";
  return "receive() external payable";
}

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
var errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
var eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
var functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
var structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
var constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
var fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
var receiveSignatureRegex = /^receive\(\) external payable$/;
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
var functionModifiers = /* @__PURE__ */ new Set([
  "calldata",
  "memory",
  "storage"
]);

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError = class extends BaseError2 {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [
        `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownTypeError"
    });
  }
};
var UnknownSolidityTypeError = class extends BaseError2 {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [`Type "${type}" is not a valid ABI type.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSolidityTypeError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError = class extends BaseError2 {
  constructor({ param }) {
    super("Invalid ABI parameter.", {
      details: param
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParameterError"
    });
  }
};
var SolidityProtectedKeywordError = class extends BaseError2 {
  constructor({ param, name }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SolidityProtectedKeywordError"
    });
  }
};
var InvalidModifierError = class extends BaseError2 {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidModifierError"
    });
  }
};
var InvalidFunctionModifierError = class extends BaseError2 {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
        `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidFunctionModifierError"
    });
  }
};
var InvalidAbiTypeParameterError = class extends BaseError2 {
  constructor({ abiParameter }) {
    super("Invalid ABI parameter.", {
      details: JSON.stringify(abiParameter, null, 2),
      metaMessages: ["ABI parameter type is invalid."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiTypeParameterError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError = class extends BaseError2 {
  constructor({ signature, type }) {
    super(`Invalid ${type} signature.`, {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidSignatureError"
    });
  }
};
var UnknownSignatureError = class extends BaseError2 {
  constructor({ signature }) {
    super("Unknown signature.", {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSignatureError"
    });
  }
};
var InvalidStructSignatureError = class extends BaseError2 {
  constructor({ signature }) {
    super("Invalid struct signature.", {
      details: signature,
      metaMessages: ["No properties exist."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidStructSignatureError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError = class extends BaseError2 {
  constructor({ type }) {
    super("Circular reference detected.", {
      metaMessages: [`Struct "${type}" is a circular reference.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CircularReferenceError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError = class extends BaseError2 {
  constructor({ current, depth }) {
    super("Unbalanced parentheses.", {
      metaMessages: [
        `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
      ],
      details: `Depth "${depth}"`
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParenthesisError"
    });
  }
};

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type) {
  if (type)
    return `${type}:${param}`;
  return param;
}
var parameterCache = /* @__PURE__ */ new Map([
  // Unnamed
  ["address", { type: "address" }],
  ["bool", { type: "bool" }],
  ["bytes", { type: "bytes" }],
  ["bytes32", { type: "bytes32" }],
  ["int", { type: "int256" }],
  ["int256", { type: "int256" }],
  ["string", { type: "string" }],
  ["uint", { type: "uint256" }],
  ["uint8", { type: "uint8" }],
  ["uint16", { type: "uint16" }],
  ["uint24", { type: "uint24" }],
  ["uint32", { type: "uint32" }],
  ["uint64", { type: "uint64" }],
  ["uint96", { type: "uint96" }],
  ["uint112", { type: "uint112" }],
  ["uint160", { type: "uint160" }],
  ["uint192", { type: "uint192" }],
  ["uint256", { type: "uint256" }],
  // Named
  ["address owner", { type: "address", name: "owner" }],
  ["address to", { type: "address", name: "to" }],
  ["bool approved", { type: "bool", name: "approved" }],
  ["bytes _data", { type: "bytes", name: "_data" }],
  ["bytes data", { type: "bytes", name: "data" }],
  ["bytes signature", { type: "bytes", name: "signature" }],
  ["bytes32 hash", { type: "bytes32", name: "hash" }],
  ["bytes32 r", { type: "bytes32", name: "r" }],
  ["bytes32 root", { type: "bytes32", name: "root" }],
  ["bytes32 s", { type: "bytes32", name: "s" }],
  ["string name", { type: "string", name: "name" }],
  ["string symbol", { type: "string", name: "symbol" }],
  ["string tokenURI", { type: "string", name: "tokenURI" }],
  ["uint tokenId", { type: "uint256", name: "tokenId" }],
  ["uint8 v", { type: "uint8", name: "v" }],
  ["uint256 balance", { type: "uint256", name: "balance" }],
  ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
  ["uint256 value", { type: "uint256", name: "value" }],
  // Indexed
  [
    "event:address indexed from",
    { type: "address", name: "from", indexed: true }
  ],
  ["event:address indexed to", { type: "address", name: "to", indexed: true }],
  [
    "event:uint indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ],
  [
    "event:uint256 indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ]
]);

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature)) {
    const match = execFunctionSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "function" });
    const inputParams = splitParameters(match.parameters);
    const inputs = [];
    const inputLength = inputParams.length;
    for (let i = 0; i < inputLength; i++) {
      inputs.push(parseAbiParameter(inputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
    const outputs = [];
    if (match.returns) {
      const outputParams = splitParameters(match.returns);
      const outputLength = outputParams.length;
      for (let i = 0; i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i], {
          modifiers: functionModifiers,
          structs,
          type: "function"
        }));
      }
    }
    return {
      name: match.name,
      type: "function",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs,
      outputs
    };
  }
  if (isEventSignature(signature)) {
    const match = execEventSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "event" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], {
        modifiers: eventModifiers,
        structs,
        type: "event"
      }));
    }
    return { name: match.name, type: "event", inputs: abiParameters };
  }
  if (isErrorSignature(signature)) {
    const match = execErrorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "error" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
    }
    return { name: match.name, type: "error", inputs: abiParameters };
  }
  if (isConstructorSignature(signature)) {
    const match = execConstructorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "constructor" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
    }
    return {
      type: "constructor",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs: abiParameters
    };
  }
  if (isFallbackSignature(signature))
    return { type: "fallback" };
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
var abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var dynamicIntegerRegex = /^u?int$/;
function parseAbiParameter(param, options) {
  var _a, _b;
  const parameterCacheKey = getParameterCacheKey(param, options == null ? void 0 : options.type);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = (options == null ? void 0 : options.structs) ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else {
    type = match.type;
    if (!((options == null ? void 0 : options.type) === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!((_b = (_a = options == null ? void 0 : options.modifiers) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, match.modifier)))
      throw new InvalidModifierError({
        param,
        type: options == null ? void 0 : options.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options == null ? void 0 : options.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0; i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
var protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
var typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!(match == null ? void 0 : match.type))
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi = [];
  const length = signatures.length;
  for (let i = 0; i < length; i++) {
    const signature = signatures[i];
    if (isStructSignature(signature))
      continue;
    abi.push(parseSignature(signature, structs));
  }
  return abi;
}

// node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}

// node_modules/viem/_esm/constants/abis.js
var multicall3Abi = [
  {
    inputs: [
      {
        components: [
          {
            name: "target",
            type: "address"
          },
          {
            name: "allowFailure",
            type: "bool"
          },
          {
            name: "callData",
            type: "bytes"
          }
        ],
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          {
            name: "success",
            type: "bool"
          },
          {
            name: "returnData",
            type: "bytes"
          }
        ],
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var universalResolverErrors = [
  {
    inputs: [],
    name: "ResolverNotFound",
    type: "error"
  },
  {
    inputs: [],
    name: "ResolverWildcardNotSupported",
    type: "error"
  },
  {
    inputs: [],
    name: "ResolverNotContract",
    type: "error"
  },
  {
    inputs: [
      {
        name: "returnData",
        type: "bytes"
      }
    ],
    name: "ResolverError",
    type: "error"
  },
  {
    inputs: [
      {
        components: [
          {
            name: "status",
            type: "uint16"
          },
          {
            name: "message",
            type: "string"
          }
        ],
        name: "errors",
        type: "tuple[]"
      }
    ],
    name: "HttpError",
    type: "error"
  }
];
var universalResolverResolveAbi = [
  ...universalResolverErrors,
  {
    name: "resolve",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes" },
      { name: "data", type: "bytes" }
    ],
    outputs: [
      { name: "", type: "bytes" },
      { name: "address", type: "address" }
    ]
  },
  {
    name: "resolve",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes" },
      { name: "data", type: "bytes" },
      { name: "gateways", type: "string[]" }
    ],
    outputs: [
      { name: "", type: "bytes" },
      { name: "address", type: "address" }
    ]
  }
];
var universalResolverReverseAbi = [
  ...universalResolverErrors,
  {
    name: "reverse",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "bytes", name: "reverseName" }],
    outputs: [
      { type: "string", name: "resolvedName" },
      { type: "address", name: "resolvedAddress" },
      { type: "address", name: "reverseResolver" },
      { type: "address", name: "resolver" }
    ]
  },
  {
    name: "reverse",
    type: "function",
    stateMutability: "view",
    inputs: [
      { type: "bytes", name: "reverseName" },
      { type: "string[]", name: "gateways" }
    ],
    outputs: [
      { type: "string", name: "resolvedName" },
      { type: "address", name: "resolvedAddress" },
      { type: "address", name: "reverseResolver" },
      { type: "address", name: "resolver" }
    ]
  }
];
var textResolverAbi = [
  {
    name: "text",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes32" },
      { name: "key", type: "string" }
    ],
    outputs: [{ name: "", type: "string" }]
  }
];
var addressResolverAbi = [
  {
    name: "addr",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "name", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }]
  },
  {
    name: "addr",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "name", type: "bytes32" },
      { name: "coinType", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bytes" }]
  }
];
var universalSignatureValidatorAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  }
];

// node_modules/viem/_esm/constants/contract.js
var aggregate3Signature = "0x82ad56cb";

// node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
var deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
var universalSignatureValidatorByteCode = "0x60806040523480156200001157600080fd5b50604051620007003803806200070083398101604081905262000034916200056f565b6000620000438484846200004f565b9050806000526001601ff35b600080846001600160a01b0316803b806020016040519081016040528181526000908060200190933c90507f6492649264926492649264926492649264926492649264926492649264926492620000a68462000451565b036200021f57600060608085806020019051810190620000c79190620005ce565b8651929550909350915060000362000192576000836001600160a01b031683604051620000f5919062000643565b6000604051808303816000865af19150503d806000811462000134576040519150601f19603f3d011682016040523d82523d6000602084013e62000139565b606091505b5050905080620001905760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b505b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90620001c4908b90869060040162000661565b602060405180830381865afa158015620001e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200020891906200069d565b6001600160e01b031916149450505050506200044a565b805115620002b157604051630b135d3f60e11b808252906001600160a01b03871690631626ba7e9062000259908890889060040162000661565b602060405180830381865afa15801562000277573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200029d91906200069d565b6001600160e01b031916149150506200044a565b8251604114620003195760405162461bcd60e51b815260206004820152603a6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e677468000000000000606482015260840162000187565b620003236200046b565b506020830151604080850151855186939260009185919081106200034b576200034b620006c9565b016020015160f81c9050601b81148015906200036b57508060ff16601c14155b15620003cf5760405162461bcd60e51b815260206004820152603b6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c75650000000000606482015260840162000187565b6040805160008152602081018083528a905260ff83169181019190915260608101849052608081018390526001600160a01b038a169060019060a0016020604051602081039080840390855afa1580156200042e573d6000803e3d6000fd5b505050602060405103516001600160a01b031614955050505050505b9392505050565b60006020825110156200046357600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b03811681146200049f57600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b83811015620004d5578181015183820152602001620004bb565b50506000910152565b600082601f830112620004f057600080fd5b81516001600160401b03808211156200050d576200050d620004a2565b604051601f8301601f19908116603f01168101908282118183101715620005385762000538620004a2565b816040528381528660208588010111156200055257600080fd5b62000565846020830160208901620004b8565b9695505050505050565b6000806000606084860312156200058557600080fd5b8351620005928162000489565b6020850151604086015191945092506001600160401b03811115620005b657600080fd5b620005c486828701620004de565b9150509250925092565b600080600060608486031215620005e457600080fd5b8351620005f18162000489565b60208501519093506001600160401b03808211156200060f57600080fd5b6200061d87838801620004de565b935060408601519150808211156200063457600080fd5b50620005c486828701620004de565b6000825162000657818460208701620004b8565b9190910192915050565b828152604060208201526000825180604084015262000688816060850160208701620004b8565b601f01601f1916919091016060019392505050565b600060208284031215620006b057600080fd5b81516001600160e01b0319811681146200044a57600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";

// node_modules/viem/_esm/constants/solidity.js
var panicReasons = {
  1: "An `assert` condition failed.",
  17: "Arithmetic operation resulted in underflow or overflow.",
  18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
  33: "Attempted to convert to an invalid type.",
  34: "Attempted to access a storage byte array that is incorrectly encoded.",
  49: "Performed `.pop()` on an empty array",
  50: "Array index is out of bounds.",
  65: "Allocated too much memory or created an array which is too large.",
  81: "Attempted to call a zero-initialized variable of internal function type."
};
var solidityError = {
  inputs: [
    {
      name: "message",
      type: "string"
    }
  ],
  name: "Error",
  type: "error"
};
var solidityPanic = {
  inputs: [
    {
      name: "reason",
      type: "uint256"
    }
  ],
  name: "Panic",
  type: "error"
};

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem2(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}

// node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError = class extends BaseError {
  constructor({ docsPath: docsPath4 }) {
    super([
      "A constructor was not found on the ABI.",
      "Make sure you are using the correct ABI and that the constructor exists on it."
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiConstructorNotFoundError"
    });
  }
};
var AbiConstructorParamsNotFoundError = class extends BaseError {
  constructor({ docsPath: docsPath4 }) {
    super([
      "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
      "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiConstructorParamsNotFoundError"
    });
  }
};
var AbiDecodingDataSizeTooSmallError = class extends BaseError {
  constructor({ data, params, size: size2 }) {
    super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
      metaMessages: [
        `Params: (${formatAbiParams(params, { includeName: true })})`,
        `Data:   ${data} (${size2} bytes)`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiDecodingDataSizeTooSmallError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
    this.params = params;
    this.size = size2;
  }
};
var AbiDecodingZeroDataError = class extends BaseError {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.');
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiDecodingZeroDataError"
    });
  }
};
var AbiEncodingArrayLengthMismatchError = class extends BaseError {
  constructor({ expectedLength, givenLength, type }) {
    super([
      `ABI encoding array length mismatch for type ${type}.`,
      `Expected length: ${expectedLength}`,
      `Given length: ${givenLength}`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEncodingArrayLengthMismatchError"
    });
  }
};
var AbiEncodingBytesSizeMismatchError = class extends BaseError {
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEncodingBytesSizeMismatchError"
    });
  }
};
var AbiEncodingLengthMismatchError = class extends BaseError {
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding params/values length mismatch.",
      `Expected length (params): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEncodingLengthMismatchError"
    });
  }
};
var AbiErrorSignatureNotFoundError = class extends BaseError {
  constructor(signature, { docsPath: docsPath4 }) {
    super([
      `Encoded error signature "${signature}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it.",
      `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiErrorSignatureNotFoundError"
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.signature = signature;
  }
};
var AbiEventSignatureEmptyTopicsError = class extends BaseError {
  constructor({ docsPath: docsPath4 }) {
    super("Cannot extract event signature from empty topics.", {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEventSignatureEmptyTopicsError"
    });
  }
};
var AbiEventSignatureNotFoundError = class extends BaseError {
  constructor(signature, { docsPath: docsPath4 }) {
    super([
      `Encoded event signature "${signature}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it.",
      `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEventSignatureNotFoundError"
    });
  }
};
var AbiEventNotFoundError = class extends BaseError {
  constructor(eventName, { docsPath: docsPath4 } = {}) {
    super([
      `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it."
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiEventNotFoundError"
    });
  }
};
var AbiFunctionNotFoundError = class extends BaseError {
  constructor(functionName, { docsPath: docsPath4 } = {}) {
    super([
      `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiFunctionNotFoundError"
    });
  }
};
var AbiFunctionOutputsNotFoundError = class extends BaseError {
  constructor(functionName, { docsPath: docsPath4 }) {
    super([
      `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
      "Cannot decode function result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath: docsPath4
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiFunctionOutputsNotFoundError"
    });
  }
};
var AbiItemAmbiguityError = class extends BaseError {
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI items.", {
      metaMessages: [
        `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
        `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItemAmbiguityError"
    });
  }
};
var BytesSizeMismatchError = class extends BaseError {
  constructor({ expectedSize, givenSize }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BytesSizeMismatchError"
    });
  }
};
var DecodeLogDataMismatch = class extends BaseError {
  constructor({ abiItem, data, params, size: size2 }) {
    super([
      `Data size of ${size2} bytes is too small for non-indexed event parameters.`
    ].join("\n"), {
      metaMessages: [
        `Params: (${formatAbiParams(params, { includeName: true })})`,
        `Data:   ${data} (${size2} bytes)`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "DecodeLogDataMismatch"
    });
    Object.defineProperty(this, "abiItem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abiItem = abiItem;
    this.data = data;
    this.params = params;
    this.size = size2;
  }
};
var DecodeLogTopicsMismatch = class extends BaseError {
  constructor({ abiItem, param }) {
    super([
      `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem, { includeName: true })}".`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "DecodeLogTopicsMismatch"
    });
    Object.defineProperty(this, "abiItem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abiItem = abiItem;
  }
};
var InvalidAbiEncodingTypeError = class extends BaseError {
  constructor(type, { docsPath: docsPath4 }) {
    super([
      `Type "${type}" is not a valid encoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath: docsPath4 });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiEncodingType"
    });
  }
};
var InvalidAbiDecodingTypeError = class extends BaseError {
  constructor(type, { docsPath: docsPath4 }) {
    super([
      `Type "${type}" is not a valid decoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath: docsPath4 });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiDecodingType"
    });
  }
};
var InvalidArrayError = class extends BaseError {
  constructor(value) {
    super([`Value "${value}" is not a valid array.`].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidArrayError"
    });
  }
};
var InvalidDefinitionTypeError = class extends BaseError {
  constructor(type) {
    super([
      `"${type}" is not a valid definition type.`,
      'Valid types: "function", "event", "error"'
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidDefinitionTypeError"
    });
  }
};

// node_modules/viem/_esm/utils/hash/hashSignature.js
var hash = (value) => keccak256(toBytes(value));
function hashSignature(sig) {
  return hash(sig);
}

// node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError("Unable to normalize signature.");
  return result;
}

// node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature = (def) => {
  const def_ = (() => {
    if (typeof def === "string")
      return def;
    return formatAbiItem(def);
  })();
  return normalizeSignature(def_);
};

// node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}

// node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);

// node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0)
    return "0x";
  return data;
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    return encodeNumber(value, { signed });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length2, data]) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed }) {
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concat([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0; i < params.length; ++i) {
    const param = params[i];
    cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
var sizeOfLength = 32;
var sizeOfOffset = 32;
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (!length) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size2] = param.type.split("bytes");
  if (!size2) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size2), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size2 = Number.parseInt(param.type.split("int")[1] || "256");
  const value = cursor.readBytes(32);
  return [
    size2 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component == null ? void 0 : component.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component == null ? void 0 : component.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(trim(data));
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  var _a;
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return (_a = param.components) == null ? void 0 : _a.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}

// node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
  const { abi, data } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === "0x")
    throw new AbiDecodingZeroDataError();
  const abi_ = [...abi || [], solidityError, solidityPanic];
  const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem2(x)));
  if (!abiItem)
    throw new AbiErrorSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeErrorResult"
    });
  return {
    abiItem,
    args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
    errorName: abiItem.name
  };
}

// node_modules/viem/_esm/utils/stringify.js
var stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
  const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
  return typeof replacer === "function" ? replacer(key, value2) : value2;
}, space);

// node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem))
    return;
  if (!("inputs" in abiItem))
    return;
  if (!abiItem.inputs)
    return;
  return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
}

// node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector = toSignatureHash;

// node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return void 0;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem = void 0;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index) => {
          return isArgOfType(Object.values(arg)[index], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}

// node_modules/viem/_esm/errors/stateOverride.js
var AccountStateConflictError = class extends BaseError {
  constructor({ address }) {
    super(`State for account "${address}" is set multiple times.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AccountStateConflictError"
    });
  }
};
var StateAssignmentConflictError = class extends BaseError {
  constructor() {
    super("state and stateDiff are set on the same account.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "StateAssignmentConflictError"
    });
  }
};
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}
`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address, ...state }) => {
    let val = `${pretty}    ${address}:
`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}
`;
    if (state.balance)
      val += `      balance: ${state.balance}
`;
    if (state.code)
      val += `      code: ${state.code}
`;
    if (state.state) {
      val += "      state:\n";
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += "      stateDiff:\n";
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, "  State Override:\n").slice(0, -1);
}

// node_modules/viem/_esm/errors/contract.js
var CallExecutionError = class extends BaseError {
  constructor(cause, { account: account_, docsPath: docsPath4, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
    var _a;
    const account = account_ ? parseAccount(account_) : void 0;
    let prettyArgs = prettyPrint({
      from: account == null ? void 0 : account.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${((_a = chain == null ? void 0 : chain.nativeCurrency) == null ? void 0 : _a.symbol) || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    if (stateOverride) {
      prettyArgs += `
${prettyStateOverride(stateOverride)}`;
    }
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath4,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Raw Call Arguments:",
        prettyArgs
      ].filter(Boolean)
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CallExecutionError"
    });
    this.cause = cause;
  }
};
var ContractFunctionExecutionError = class extends BaseError {
  constructor(cause, { abi, args, contractAddress, docsPath: docsPath4, functionName, sender }) {
    const abiItem = getAbiItem({ abi, args, name: functionName });
    const formattedArgs = abiItem ? formatAbiItemWithArgs({
      abiItem,
      args,
      includeFunctionName: false,
      includeName: false
    }) : void 0;
    const functionWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
    const prettyArgs = prettyPrint({
      address: contractAddress && getContractAddress(contractAddress),
      function: functionWithParams,
      args: formattedArgs && formattedArgs !== "()" && `${[...Array((functionName == null ? void 0 : functionName.length) ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
      sender
    });
    super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
      cause,
      docsPath: docsPath4,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Contract Call:",
        prettyArgs
      ].filter(Boolean)
    });
    Object.defineProperty(this, "abi", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "args", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "contractAddress", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "formattedArgs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "functionName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sender", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ContractFunctionExecutionError"
    });
    this.abi = abi;
    this.args = args;
    this.cause = cause;
    this.contractAddress = contractAddress;
    this.functionName = functionName;
    this.sender = sender;
  }
};
var ContractFunctionRevertedError = class extends BaseError {
  constructor({ abi, data, functionName, message }) {
    let cause;
    let decodedData = void 0;
    let metaMessages;
    let reason;
    if (data && data !== "0x") {
      try {
        decodedData = decodeErrorResult({ abi, data });
        const { abiItem, errorName, args: errorArgs } = decodedData;
        if (errorName === "Error") {
          reason = errorArgs[0];
        } else if (errorName === "Panic") {
          const [firstArg] = errorArgs;
          reason = panicReasons[firstArg];
        } else {
          const errorWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
          const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
            abiItem,
            args: errorArgs,
            includeFunctionName: false,
            includeName: false
          }) : void 0;
          metaMessages = [
            errorWithParams ? `Error: ${errorWithParams}` : "",
            formattedArgs && formattedArgs !== "()" ? `       ${[...Array((errorName == null ? void 0 : errorName.length) ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
          ];
        }
      } catch (err) {
        cause = err;
      }
    } else if (message)
      reason = message;
    let signature;
    if (cause instanceof AbiErrorSignatureNotFoundError) {
      signature = cause.signature;
      metaMessages = [
        `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
        "Make sure you are using the correct ABI and that the error exists on it.",
        `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
      ];
    }
    super(reason && reason !== "execution reverted" || signature ? [
      `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
      reason || signature
    ].join("\n") : `The contract function "${functionName}" reverted.`, {
      cause,
      metaMessages
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ContractFunctionRevertedError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "reason", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = decodedData;
    this.reason = reason;
    this.signature = signature;
  }
};
var ContractFunctionZeroDataError = class extends BaseError {
  constructor({ functionName }) {
    super(`The contract function "${functionName}" returned no data ("0x").`, {
      metaMessages: [
        "This could be due to any of the following:",
        `  - The contract does not have the function "${functionName}",`,
        "  - The parameters passed to the contract function may be invalid, or",
        "  - The address is not a contract."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ContractFunctionZeroDataError"
    });
  }
};
var CounterfactualDeploymentFailedError = class extends BaseError {
  constructor({ factory }) {
    super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
      metaMessages: [
        "Please ensure:",
        "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
        "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CounterfactualDeploymentFailedError"
    });
  }
};
var RawContractError = class extends BaseError {
  constructor({ data, message }) {
    super(message || "");
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RawContractError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
  }
};

// node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
var docsPath = "/docs/contract/decodeFunctionResult";
function decodeFunctionResult(parameters) {
  const { abi, args, functionName, data } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return void 0;
}

// node_modules/viem/_esm/utils/abi/encodeDeployData.js
var docsPath2 = "/docs/contract/encodeDeployData";
function encodeDeployData(parameters) {
  const { abi, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi.find((x) => "type" in x && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath: docsPath2 });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath2 });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath2 });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}

// node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
var docsPath3 = "/docs/contract/encodeFunctionData";
function prepareEncodeFunctionData(parameters) {
  const { abi, args, functionName } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath3 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath3 });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem2(abiItem))
  };
}

// node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi, functionName } = (() => {
    var _a;
    if (parameters.abi.length === 1 && ((_a = parameters.functionName) == null ? void 0 : _a.startsWith("0x")))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
  return concatHex([signature, data ?? "0x"]);
}

// node_modules/viem/_esm/errors/request.js
var HttpRequestError = class extends BaseError {
  constructor({ body, cause, details, headers, status, url }) {
    super("HTTP request failed.", {
      cause,
      details,
      metaMessages: [
        status && `Status: ${status}`,
        `URL: ${getUrl(url)}`,
        body && `Request body: ${stringify(body)}`
      ].filter(Boolean)
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "HttpRequestError"
    });
    Object.defineProperty(this, "body", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "status", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.url = url;
  }
};
var WebSocketRequestError = class extends BaseError {
  constructor({ body, details, url }) {
    super("WebSocket request failed.", {
      details,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "WebSocketRequestError"
    });
  }
};
var RpcRequestError = class extends BaseError {
  constructor({ body, error, url }) {
    super("RPC Request failed.", {
      cause: error,
      details: error.message,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcRequestError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = error.code;
  }
};
var TimeoutError = class extends BaseError {
  constructor({ body, url }) {
    super("The request took too long to respond.", {
      details: "The request timed out.",
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TimeoutError"
    });
  }
};

// node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode = -1;
var RpcError = class extends BaseError {
  constructor(cause, { code, docsPath: docsPath4, metaMessages, shortMessage }) {
    super(shortMessage, {
      cause,
      docsPath: docsPath4,
      metaMessages: metaMessages || (cause == null ? void 0 : cause.metaMessages)
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RpcError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = cause.name;
    this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
  }
};
var ProviderRpcError = class extends RpcError {
  constructor(cause, options) {
    super(cause, options);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ProviderRpcError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = options.data;
  }
};
var ParseRpcError = class _ParseRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _ParseRpcError.code,
      shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ParseRpcError"
    });
  }
};
Object.defineProperty(ParseRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32700
});
var InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _InvalidRequestRpcError.code,
      shortMessage: "JSON is not a valid request object."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidRequestRpcError"
    });
  }
};
Object.defineProperty(InvalidRequestRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32600
});
var MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _MethodNotFoundRpcError.code,
      shortMessage: "The method does not exist / is not available."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "MethodNotFoundRpcError"
    });
  }
};
Object.defineProperty(MethodNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32601
});
var InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _InvalidParamsRpcError.code,
      shortMessage: [
        "Invalid parameters were provided to the RPC method.",
        "Double check you have provided the correct parameters."
      ].join("\n")
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParamsRpcError"
    });
  }
};
Object.defineProperty(InvalidParamsRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32602
});
var InternalRpcError = class _InternalRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _InternalRpcError.code,
      shortMessage: "An internal error was received."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InternalRpcError"
    });
  }
};
Object.defineProperty(InternalRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32603
});
var InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _InvalidInputRpcError.code,
      shortMessage: [
        "Missing or invalid parameters.",
        "Double check you have provided the correct parameters."
      ].join("\n")
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidInputRpcError"
    });
  }
};
Object.defineProperty(InvalidInputRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32e3
});
var ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _ResourceNotFoundRpcError.code,
      shortMessage: "Requested resource not found."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ResourceNotFoundRpcError"
    });
  }
};
Object.defineProperty(ResourceNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32001
});
var ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _ResourceUnavailableRpcError.code,
      shortMessage: "Requested resource not available."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ResourceUnavailableRpcError"
    });
  }
};
Object.defineProperty(ResourceUnavailableRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32002
});
var TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _TransactionRejectedRpcError.code,
      shortMessage: "Transaction creation failed."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "TransactionRejectedRpcError"
    });
  }
};
Object.defineProperty(TransactionRejectedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32003
});
var MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _MethodNotSupportedRpcError.code,
      shortMessage: "Method is not implemented."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "MethodNotSupportedRpcError"
    });
  }
};
Object.defineProperty(MethodNotSupportedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32004
});
var LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _LimitExceededRpcError.code,
      shortMessage: "Request exceeds defined limit."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "LimitExceededRpcError"
    });
  }
};
Object.defineProperty(LimitExceededRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32005
});
var JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: _JsonRpcVersionUnsupportedError.code,
      shortMessage: "Version of JSON-RPC protocol is not supported."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "JsonRpcVersionUnsupportedError"
    });
  }
};
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32006
});
var UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _UserRejectedRequestError.code,
      shortMessage: "User rejected the request."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UserRejectedRequestError"
    });
  }
};
Object.defineProperty(UserRejectedRequestError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4001
});
var UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _UnauthorizedProviderError.code,
      shortMessage: "The requested method and/or account has not been authorized by the user."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnauthorizedProviderError"
    });
  }
};
Object.defineProperty(UnauthorizedProviderError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4100
});
var UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _UnsupportedProviderMethodError.code,
      shortMessage: "The Provider does not support the requested method."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnsupportedProviderMethodError"
    });
  }
};
Object.defineProperty(UnsupportedProviderMethodError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4200
});
var ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _ProviderDisconnectedError.code,
      shortMessage: "The Provider is disconnected from all chains."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ProviderDisconnectedError"
    });
  }
};
Object.defineProperty(ProviderDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4900
});
var ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _ChainDisconnectedError.code,
      shortMessage: "The Provider is not connected to the requested chain."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ChainDisconnectedError"
    });
  }
};
Object.defineProperty(ChainDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4901
});
var SwitchChainError = class _SwitchChainError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: _SwitchChainError.code,
      shortMessage: "An error occurred when attempting to switch chain."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SwitchChainError"
    });
  }
};
Object.defineProperty(SwitchChainError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4902
});
var UnknownRpcError = class extends RpcError {
  constructor(cause) {
    super(cause, {
      shortMessage: "An unknown RPC error occurred."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownRpcError"
    });
  }
};

// node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
  const message = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError ? err.walk((e) => e.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError) {
    return new ExecutionRevertedError({
      cause: err,
      message: executionRevertedError.details
    });
  }
  if (ExecutionRevertedError.nodeMessage.test(message))
    return new ExecutionRevertedError({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args == null ? void 0 : args.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args == null ? void 0 : args.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message))
    return new NonceTooHighError({ cause: err, nonce: args == null ? void 0 : args.nonce });
  if (NonceTooLowError.nodeMessage.test(message))
    return new NonceTooLowError({ cause: err, nonce: args == null ? void 0 : args.nonce });
  if (NonceMaxValueError.nodeMessage.test(message))
    return new NonceMaxValueError({ cause: err, nonce: args == null ? void 0 : args.nonce });
  if (InsufficientFundsError.nodeMessage.test(message))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message))
    return new IntrinsicGasTooHighError({ cause: err, gas: args == null ? void 0 : args.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message))
    return new IntrinsicGasTooLowError({ cause: err, gas: args == null ? void 0 : args.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args == null ? void 0 : args.maxFeePerGas,
      maxPriorityFeePerGas: args == null ? void 0 : args.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}

// node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath: docsPath4, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath4,
    ...args
  });
}

// node_modules/viem/_esm/utils/formatters/extract.js
function extract(value_, { format }) {
  if (!format)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  const formatted = format(value_ || {});
  extract_(formatted);
  return value;
}

// node_modules/viem/_esm/utils/promise/createBatchScheduler.js
var schedulerCache = /* @__PURE__ */ new Map();
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      var _a;
      if (sort && Array.isArray(data))
        data.sort(sort);
      for (let i = 0; i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        (_a = pendingPromise.resolve) == null ? void 0 : _a.call(pendingPromise, [data[i], data]);
      }
    }).catch((err) => {
      var _a;
      for (let i = 0; i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        (_a = pendingPromise.reject) == null ? void 0 : _a.call(pendingPromise, err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const pendingPromise = {};
      const promise = new Promise((resolve, reject) => {
        pendingPromise.resolve = resolve;
        pendingPromise.reject = reject;
      });
      const split = shouldSplitBatch == null ? void 0 : shouldSplitBatch([...getBatchedArgs(), args]);
      if (split)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, pendingPromise });
        return promise;
      }
      setScheduler({ args, pendingPromise });
      setTimeout(exec, wait);
      return promise;
    }
  };
}

// node_modules/viem/_esm/utils/stateOverride.js
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return void 0;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== void 0)
    rpcAccountStateOverride.code = code;
  if (balance !== void 0)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== void 0)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== void 0)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== void 0) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError();
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return void 0;
  const rpcStateOverride = {};
  for (const { address, ...accountState } of parameters) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    if (rpcStateOverride[address])
      throw new AccountStateConflictError({ address });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}

// node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
  const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
    throw new FeeConflictError();
  if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}

// node_modules/viem/_esm/actions/public/call.js
async function call(client, args) {
  var _a, _b, _c, _d;
  const { account: account_ = client.account, batch = Boolean((_a = client.batch) == null ? void 0 : _a.multicall), blockNumber, blockTag = "latest", accessList, blobs, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (code && (factory || factoryData))
    throw new BaseError("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code && to)
    throw new BaseError("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code && data_;
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const chainFormat = (_d = (_c = (_b = client.chain) == null ? void 0 : _b.formatters) == null ? void 0 : _c.transactionRequest) == null ? void 0 : _d.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      from: account == null ? void 0 : account.address,
      accessList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? void 0 : to,
      value
    });
    if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride) {
      try {
        return await scheduleMulticall(client, {
          ...request,
          blockNumber,
          blockTag
        });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const response = await client.request({
      method: "eth_call",
      params: rpcStateOverride ? [
        request,
        block,
        rpcStateOverride
      ] : [request, block]
    });
    if (response === "0x")
      return { data: void 0 };
    return { data: response };
  } catch (err) {
    const data2 = getRevertErrorData(err);
    const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await import("./ccip-ETIKZOFI.js");
    if (client.ccipRead !== false && (data2 == null ? void 0 : data2.slice(0, 10)) === offchainLookupSignature2 && to)
      return { data: await offchainLookup2(client, { data: data2, to }) };
    if (deploylessCall && (data2 == null ? void 0 : data2.slice(0, 10)) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
function shouldPerformMulticall({ request }) {
  const { data, to, ...request_ } = request;
  if (!data)
    return false;
  if (data.startsWith(aggregate3Signature))
    return false;
  if (!to)
    return false;
  if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
    return false;
  return true;
}
async function scheduleMulticall(client, args) {
  var _a;
  const { batchSize = 1024, wait = 0 } = typeof ((_a = client.batch) == null ? void 0 : _a.multicall) === "object" ? client.batch.multicall : {};
  const { blockNumber, blockTag = "latest", data, multicallAddress: multicallAddress_, to } = args;
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new ClientChainNotConfiguredError();
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
  const block = blockNumberHex || blockTag;
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block}`,
    wait,
    shouldSplitBatch(args2) {
      const size2 = args2.reduce((size3, { data: data2 }) => size3 + (data2.length - 2), 0);
      return size2 > batchSize * 2;
    },
    fn: async (requests) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const data2 = await client.request({
        method: "eth_call",
        params: [
          {
            data: calldata,
            to: multicallAddress
          },
          block
        ]
      });
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data2 || "0x"
      });
    }
  });
  const [{ returnData, success }] = await schedule({ data, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: void 0 };
  return { data: returnData };
}
function toDeploylessCallViaBytecodeData(parameters) {
  const { code, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code, data]
  });
}
function toDeploylessCallViaFactoryData(parameters) {
  const { data, factory, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to, data, factory, factoryData]
  });
}
function getRevertErrorData(err) {
  var _a;
  if (!(err instanceof BaseError))
    return void 0;
  const error = err.walk();
  return typeof (error == null ? void 0 : error.data) === "object" ? (_a = error.data) == null ? void 0 : _a.data : error.data;
}

// node_modules/viem/_esm/errors/ccip.js
var OffchainLookupError = class extends BaseError {
  constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
    var _a;
    super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
      cause,
      metaMessages: [
        ...cause.metaMessages || [],
        ((_a = cause.metaMessages) == null ? void 0 : _a.length) ? "" : [],
        "Offchain Gateway Call:",
        urls && [
          "  Gateway URL(s):",
          ...urls.map((url) => `    ${getUrl(url)}`)
        ],
        `  Sender: ${sender}`,
        `  Data: ${data}`,
        `  Callback selector: ${callbackSelector}`,
        `  Extra data: ${extraData}`
      ].flat()
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "OffchainLookupError"
    });
  }
};
var OffchainLookupResponseMalformedError = class extends BaseError {
  constructor({ result, url }) {
    super("Offchain gateway response is malformed. Response data must be a hex value.", {
      metaMessages: [
        `Gateway URL: ${getUrl(url)}`,
        `Response: ${stringify(result)}`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "OffchainLookupResponseMalformedError"
    });
  }
};
var OffchainLookupSenderMismatchError = class extends BaseError {
  constructor({ sender, to }) {
    super("Reverted sender address does not match target contract address (`to`).", {
      metaMessages: [
        `Contract address: ${to}`,
        `OffchainLookup sender address: ${sender}`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "OffchainLookupSenderMismatchError"
    });
  }
};

// node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}

// node_modules/viem/_esm/utils/ccip.js
var offchainLookupSignature = "0x556f1830";
var offchainLookupAbiItem = {
  name: "OffchainLookup",
  type: "error",
  inputs: [
    {
      name: "sender",
      type: "address"
    },
    {
      name: "urls",
      type: "string[]"
    },
    {
      name: "callData",
      type: "bytes"
    },
    {
      name: "callbackFunction",
      type: "bytes4"
    },
    {
      name: "extraData",
      type: "bytes"
    }
  ]
};
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
  const { args } = decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof (ccipRead == null ? void 0 : ccipRead.request) === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = await ccipRequest_({ data: callData, sender, urls });
    const { data: data_ } = await call(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      to
    });
    return data_;
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data, sender, urls }) {
  var _a;
  let error = new Error("An unknown error occurred.");
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : void 0;
    try {
      const response = await fetch(url.replace("{sender}", sender).replace("{data}", data), {
        body: JSON.stringify(body),
        method
      });
      let result;
      if ((_a = response.headers.get("Content-Type")) == null ? void 0 : _a.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: (result == null ? void 0 : result.error) ? stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      error = new HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}

export {
  formatAbiItem2 as formatAbiItem,
  AbiDecodingDataSizeTooSmallError,
  AbiDecodingZeroDataError,
  AbiEventSignatureEmptyTopicsError,
  AbiEventSignatureNotFoundError,
  AbiEventNotFoundError,
  BytesSizeMismatchError,
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
  encodeAbiParameters,
  encodeDeployData,
  parseAccount,
  stringify,
  HttpRequestError,
  WebSocketRequestError,
  RpcRequestError,
  TimeoutError,
  ParseRpcError,
  InvalidRequestRpcError,
  MethodNotFoundRpcError,
  InvalidParamsRpcError,
  InternalRpcError,
  InvalidInputRpcError,
  ResourceNotFoundRpcError,
  ResourceUnavailableRpcError,
  TransactionRejectedRpcError,
  MethodNotSupportedRpcError,
  LimitExceededRpcError,
  JsonRpcVersionUnsupportedError,
  UserRejectedRequestError,
  UnauthorizedProviderError,
  UnsupportedProviderMethodError,
  ProviderDisconnectedError,
  ChainDisconnectedError,
  SwitchChainError,
  UnknownRpcError,
  getNodeError,
  extract,
  assertRequest,
  serializeStateOverride,
  multicall3Abi,
  universalResolverResolveAbi,
  universalResolverReverseAbi,
  textResolverAbi,
  addressResolverAbi,
  universalSignatureValidatorAbi,
  decodeAbiParameters,
  toEventSelector,
  getAbiItem,
  decodeFunctionResult,
  encodeFunctionData,
  panicReasons,
  CallExecutionError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  RawContractError,
  universalSignatureValidatorByteCode,
  createBatchScheduler,
  isAddressEqual,
  offchainLookupSignature,
  offchainLookupAbiItem,
  offchainLookup,
  ccipRequest,
  call
};
//# sourceMappingURL=chunk-7GWGDMOR.js.map
