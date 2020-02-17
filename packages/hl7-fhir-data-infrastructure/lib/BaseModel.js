import SimpleSchema from 'simpl-schema';

import { map, omit, extend, isObject, each, isFunction } from 'lodash';


if (typeof Object.create !== 'function') {
  Object.create = (function () {
    var thing = function () {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype !== 'object') {
        throw TypeError('Argument must be an object');
      }
      thing.prototype = prototype;
      var result = new thing();
      thing.prototype = null;
      return result;
    };
  })();
}

var diff = function (a, b) {
  var keys = map(a, function (v, k) {
    if (b[k] === v) {
      return k;
    }
  });
  return omit(a, keys);
};



/*globals BaseModel:true*/

BaseModel = function () {};

BaseModel.createEmpty = function (_id) {
  return new this({
    _id: _id
  });
};

BaseModel.extend = function () {
  var child = function (document) {
    extend(this, document);
    this._document = document;
  };

  //add Static properties and methods
  extend(child, this);

  //prototypal inheritence
  child.prototype = Object.create(this.prototype);
  child.prototype.constructor = child;

  //access to parent
  child.prototype._parent_ = this;
  child.prototype._super_ = this.prototype;

  return child;
};

BaseModel.extendAndSetupCollection = function (collectionName) {
  var model = this.extend();

  model.collection = model.prototype._collection = new Mongo.Collection(collectionName, {
    transform: function (document) {
      return new model(document);
    }
  });

  Meteor[collectionName] = model.collection;

  return model;
};

BaseModel.appendSchema = function (schemaObject) {
  var schema = new SimpleSchema(schemaObject);
  var collection = this.prototype._collection;

  if (collection) {
    collection.attachSchema(schema);
    this.prototype._validator = schema.newContext();
  } else {
    throw new Error(
      "Can't append schema to non existent collection. Either use extendAndSetupCollection() or assign a collection to Model.prototype._collection"
    );
  }
};

BaseModel.methods = function (methodMap) {
  var self = this;
  if (isObject(methodMap)) {
    each(methodMap, function (method, name) {
      if (isFunction(method)) {
        if (!self.prototype[name]) {
          self.prototype[name] = method;
        } else {
          throw new Meteor.Error("existent-method", "The method " + name + " already exists.");
        }
      }
    });
  }
};

BaseModel.prototype._getSchema = function () {
  return this._collection._c2._simpleSchema;
};

BaseModel.prototype._checkCollectionExists = function () {
  if (!this._collection) {
    throw new Error(
      "No collection found. Either use extendAndSetupCollection() or assign a collection to Model.prototype._collection"
    );
  }
};

BaseModel.prototype.getCollectionName = function () {
  this._checkCollectionExists();
  return this._collection._name;
};

BaseModel.prototype.checkOwnership = function () {
  return this.userId === Meteor.userId();
};

// ===============================================
// crud/persistence functions

BaseModel.prototype.save = function (callback) {
  this._checkCollectionExists();
  var obj = {};
  var schema = this._getSchema();

  each(this, function (value, key) {
    if (key !== "_document") {
      obj[key] = value;
    }
  });


  if (this._id) {
    obj = diff(obj, this._document);
    console.log(obj);
    this._collection.update(this._id, {
      $set: obj
    }, callback);
  } else {
    if (Meteor.isClient && schema) {
      obj = schema.clean(obj);
    }
    this._id = this._collection.insert(obj, callback);
  }

  return this;
};

BaseModel.prototype.update = function (modifier) {
  if (this._id) {
    this._checkCollectionExists();

    this._collection.update(this._id, modifier);
  }
};

BaseModel.prototype._updateLocal = function (modifier) {
  this._collection._collection.update(this._id, modifier);
};

BaseModel.prototype.set = function (key, value) {
  var obj = {};
  obj[key] = value;
  this[key] = value;
  this._id && this._updateLocal({
    $set: obj
  });
  return this;
};

BaseModel.prototype.remove = function () {
  if (this._id) {
    this._checkCollectionExists();

    this._collection.remove({
      _id: this._id
    });
  }
};

// ===============================================
// validation functions

BaseModel.prototype.clean = function () {
  if(this._collection._c2._simpleSchema){
    return this._collection._c2._simpleSchema.clean(this._document);
  }
};

BaseModel.prototype.validate = function (options) {
  var validator = this.prototype._validator;

  if (validator) {
    validator.validate(this, options)
  } else {
    throw new Error(
      "Can't validate document when object doesn't have a schema and validation context. Use .appendSchema()"
      );
  }
};

export default BaseModel