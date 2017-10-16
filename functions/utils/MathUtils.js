'use strict';

exports.MathUtils = {
    toRad: function(degrees) {
        return degrees * Math.PI / 180;
    },


    toDeg: function(radians) {
        return radians * 180 / Math.PI;
    }
};