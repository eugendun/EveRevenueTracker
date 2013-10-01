/// <reference path="../require.js" />

define(function () {

    /**
        Ensure that the constructor attribute is set correctly on the superclass
        (even if the superclass is the Object class itself). This will become important
        when you use this new superclass attribute to call the superclass's constructor.
        Adding the superclass attribute also allows you to call methods directly from the
        superclass. As a bonus, it adds the empty class F into the prototype chain in order
        to prevent a new instance of the superclass having to be instantiated.
    */
    extend = function (subClass, superClass) {
        function F() { };
        F.prototype = superClass;
        subClass.prototype = new F;
        subClass.prototype.constructor = subClass;
        subClass.superclass = superClass.prototype;
        if (subClass.prototype.constructor == Object.prototype.constructor) {
            subClass.prototype.constructor = superClass;
        }
    };

    /**
        Creates a new and empty function F. It then sets the prototype attribute of F to
        the prototype object. The prototype attributes is meant to point to the prototype
        object, and through prototype chaining it provides links the all the inherited 
        members.
    */
    clone = function (object) {
        function F() { };
        F.prototype = object;
        return new F;
    };
});