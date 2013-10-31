/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 7:32
 */
/*global define:true*/

define('obj', ['tool', 'str'], function (tool, str) {
    'use strict';
    var map = {},
        extend = tool.extend,
        err = str.err,
        fn = str._serv_.TFunc,
        notFoundErr = function (type) {
            return new Error('Object \'' + type + '\' not found', 'obj');
        },
        wrongParamsErr = function (method) {
            return new Error('Wrong parameters in ' + method, 'obj');
        },
        buildMapObj = function (t, o) {
            var isSingle = o.$isSingle,
                extendType = o.$extend,
                parent,
                prop,
                $proto = {},
                $obj = {},
                $mapObj = {
                    $obj: $obj,
                    $proto: $proto,
                    $extend: extendType,
                    $mixin: o.$mixin,
                    $static: o.$static,
                    $isSingle: isSingle
                };
            delete o.$isSingle;
            delete o.$extend;
            delete o.$mixin;
            delete o.$static;
            for (prop in o) {
                if (o.hasOwnProperty(prop)) {
                    switch (typeof o[prop]) {
                    case fn:
                        $proto[prop] = o[prop];
                        break;
                    default:
                        $obj[prop] = o[prop];
                    }
                }
            }
            if (extendType) {
                parent = map[extendType];
                if (!parent) {
                    throw new Error('Base type not found');
                }
                extend($obj, parent.$obj, false);
                $proto = extend(Object.create(parent.$proto), $proto, true);
                $proto.$base = parent.$constructor;
                $proto.$baseproto = parent.$proto;
                $proto.$getType = function () {
                    return t;
                };
                $mapObj.$proto = $proto;
            }
            $mapObj.$constructor = function () {
                extend(this, $obj, true);
            };
            $mapObj.$constructor.prototype = $proto;
            return $mapObj;
        },
        obj = {
            define: function (objName, secondParam) {
                var me = this,
                    paramsLen = arguments.length,
                    $mapObj;
                switch (paramsLen) {
                case 1:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    break;
                case 2:
                    if (secondParam !== null) {
                        $mapObj = buildMapObj(objName, secondParam);
                        map[objName] = $mapObj;
                    } else {
                        delete map[objName];
                        return;
                    }
                    break;
                default:
                    throw wrongParamsErr('define');
                }
                return $mapObj.$constructor;
            },
            create: function (objName, mergeObj) {
                var paramsLen = arguments.length,
                    $mapObj,
                    exemplar;
                switch (paramsLen) {
                case 1:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    exemplar = new $mapObj.$constructor();
                    break;
                case 2:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    exemplar = new $mapObj.$constructor();
                    extend(exemplar, mergeObj, true);
                    break;
                default:
                    throw wrongParamsErr('create');
                }
                return exemplar;
            }
        };
    return obj;
});