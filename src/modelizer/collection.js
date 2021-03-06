Modelizer.Collection = {
	insert: function(instance) {
	  if(instance.get('id') && this.exists(instance.get('id'))) {
	    var existing_instance = this.find(instance.get('id'));
	    existing_instance.update(instance.attributes);
	  } else {
      this.all().push(instance);
      this.notify('insert', instance);
		}
	},
	create: function(array_or_hash) {
	  var method_ext = $.isArray(array_or_hash) ? 'Many' : 'One';
	  this['create' + method_ext](array_or_hash);
	},
	createOne: function(hash) {
	  new this(hash);
	},
	createMany: function(array) {
		var self = this;
		$.each(array, function(i, v) {
			self.create(v);
		});
	},
  clear: function() {
  		while(this.first()) {
        this.remove(this.first().get('id'));
  		}
		  this.notify('cleared');
  },
	remove: function(instance) {
		var index = $.inArray(instance, this.all());
		this.all().splice(index, 1);
		this.notify('remove', instance);
	},
	find: function(id) {
		return this.first({ 'id': id });
	},
	all: function() {
		this.instances = this.instances || [];
		return this.instances;
	},
	exists: function(id) {
	  return !!this.find(id);
	},
	count: function() {
	  return this.all().length;
	},
	first: function(conditions) {
		var self = this;
		var instance;
		$.each(this.all(), function(n, i) {
		  if(!conditions) {
		    instance = self.all()[0];
		    return false;
		  }
		  
			if(self.match(i, conditions)) {
				instance = i;
				return false;
			};
		});
		return instance;
	},
	last: function(conditions) {
		var elms;
		if(conditions == null) {
			elms = this.all();
		} else {
			elms = this.where(conditions);
		}
		return elms[elms.length - 1];
	},
	where: function(conditions) {
		var self = this;
		return $.grep(this.all(), function(i) {
			return self.match(i, conditions);
		});
	},
	createOrUpdate: function(array_or_hash) {
	  var method_ext = $.isArray(array_or_hash) ? 'Many' : 'One';
	  this['createOrUpdate' + method_ext](array_or_hash);
	},
	createOrUpdateOne: function(attributes) {
    var existing_instance;
    if(attributes.id) {
      existing_instance = this.find(attributes.id);
    }
    if(existing_instance) {
      delete attributes.id;
      existing_instance.update(attributes);
    } else {
      // new this(attributes);
      this.create(attributes);
    }
	},
	createOrUpdateMany: function(array) {
		var self = this;
		$.each(array, function(i, v) {
			self.createOrUpdate(v);
		});
	},
	match: function(instance, conditions) {
		var match = true;
		$.each(conditions, function(key, value) {
			if(instance.get(key) != value) {
				match = false;
				return false;
			}
		});
		return match;
	}
};
$.extend(Modelizer.Collection, Observable);
