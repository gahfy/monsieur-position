'use strict';

exports.FrenchStringUtils = {
    DIRECTION_NAMES: [
        "Nord",
        "Nord-Est",
        "Est",
        "Sud-Est",
        "Sud",
        "Sud-Ouest",
        "Ouest",
        "Nord-Ouest"
    ],

    getPrefixedDirection: function(directionIndex){
        let direction = this.DIRECTION_NAMES[directionIndex];
        return this.addDirectionDefiniteArticle(direction);
    },

    addDirectionDefiniteArticle: function(expression){
        if(expression.trim().toLowerCase().substring(0, 1) === "a"
        || expression.trim().toLowerCase().substring(0, 1) === "e"
        || expression.trim().toLowerCase().substring(0, 1) === "i"
        || expression.trim().toLowerCase().substring(0, 1) === "o"
        || expression.trim().toLowerCase().substring(0, 1) === "u"
        || expression.trim().toLowerCase().substring(0, 1) === "y"){
            return "à l'"+expression;
        }
        return "au "+expression;
    }
};