//========== CONFIG ==========
var CONFIG = require("../config.js");

// reserved field names
const reserved_field_names = ["objectId", "createdAt", "updatedAt", "ACL"];

// gets the schema field type generator
function get_schema_field_type_generator(field_type) {
	switch(field_type) {
		case 'number': return 'addNumber';
		case 'boolean': return 'addBoolean';
		case 'date': return 'addDate';
		case 'file': return 'addFile';
		case 'geopoint': return 'addGeoPoint';
		case 'polygon': return 'addPolygon';
		case 'array': return 'addArray';
		case 'object': return 'addObject';
		case 'pointer': return 'addPointer';
		case 'relation': return 'addRelation';
		case 'string': default: return 'addString';
	}
}

// function that adds a field to the schema
function add_schema_field(schema, field_name, field_settings) {
	let field_target_class = field_settings.target_class || "";
	let field_type = field_settings.type || "";
	if(field_type != "") {
		if((field_type == "pointer") || (field_type == "relation")) {
			if(field_target_class != "") {
				schema[get_schema_field_type_generator(field_type)](field_name, field_target_class);
			}
		} else {
			schema[get_schema_field_type_generator(field_type)](field_name);
		}
	}
	return schema;
}

// function that adds a field to the schema
function add_schema_field(schema, field_name, field_settings) {
	let field_target_class = field_settings.target_class || "";
	let field_type = field_settings.type || "";
	if(field_type != "") {
		if((field_type == "pointer") || (field_type == "relation")) {
			if(field_target_class != "") {
				schema[get_schema_field_type_generator(field_type)](field_name, field_target_class);
			}
		} else {
			schema[get_schema_field_type_generator(field_type)](field_name);
		}
	}
	return schema;
}

// functon to remove a field from a schema
function remove_schema_field(schema, field_name, target_class) {
	schema.deleteField(field_name, target_class);
	return schema;
}

// function to update class level permissions
function update_class_permissions(class_name, class_permissions) {
	// since we don't have direct access to update the class permissions
	// we are going to use the same api endpoint that the parse dashboard does
	// this should ensure that we aren't managing any database connections or writing anything that might break
	return Parse.Cloud.httpRequest({
		url : CONFIG.API_URL + "/schemas/" + class_name,
		method : "PUT",
		headers : { 
			"X-Parse-Application-Id" : CONFIG.APP_ID,
			"X-Parse-Master-Key" : CONFIG.MASTER_KEY,
			"Content-Type" : "application/json"
		},
		body : JSON.stringify({ classLevelPermissions : class_permissions })
	});
}

module.exports = class Abstract_Parse_Object extends Parse.Object {
	
	constructor(class_name, field_settings, class_permissions, options) {
		// pass the class name to the constructor
		super(class_name);
		
		// set field settings
		// example: { key1 : { type: 'string', required: false, default_value: "f1" }, key2 : { type : 'pointer', target_class : "TEST", required : false, default_value: undefined } }
		this.field_settings = field_settings || {};
		
		// set class level permissions
		// example: { find: { '*': true }, create: { '*': true }, get: { '*': true }, update: { '*': true },  addField: { '*': true }, delete: { '*': true } }
		this.class_permissions = class_permissions || {};
		
		// set options
		this.options = Object.assign({
			refresh_schema: false,
			register_triggers : false
		}, options || {})
		
		// refresh schema + permissions
		if(this.options.refresh_schema) {
			this.update_schema();
		}
		
		// attach triggers
		if(this.options.register_triggers) {
			this.register_parse_triggers();
		}
	}
	
	// register parse triggers
	register_parse_triggers() {
		// thisObject
		const thisObject = this;
		
		// before save
		Parse.Cloud.beforeSave(this.className, function(request, response) {
			return thisObject.beforeSave(request).then(function(request) {
		        return response.success();
		    }, function(errors) {
		        return response.error(thisObject.handle_errors(errors));
		    });
		});
		
		// after save
		Parse.Cloud.afterSave(this.className, function(request) {
			return thisObject.afterSave(request).then(function(request) {
		        // nothing
		    }, function(errors) {
		        // nothing
		    });
		});
	
		// before delete
		Parse.Cloud.beforeDelete(this.className, function(request, response) {
			return thisObject.beforeDelete(request).then(function(request) {
			    return response.success();
		    }, function(errors) {
		    	return response.error(thisObject.handle_errors(errors));
		    });
		});
		
		// after delete
		Parse.Cloud.afterDelete(this.className, function(request) {
			return thisObject.afterDelete(request).then(function(request) {
		        // nothing
		    }, function(errors) {
		        // nothing
		    });
		});
	}
	
	// register jobs
	register_parse_job(job_name, callback) {
		if (this[callback] != undefined) {
			Parse.Cloud.job(job_name, this[callback]);
		}
	}
	
	// updates the db schema
	update_schema() {
		const thisObject = this;
		const this_schema = new Parse.Schema(this.className);
		return this_schema.get({ useMasterKey : true }).then(function(schema_data) {
			// schema already exists
			// lets first capture all the user generated fields with type and class
			const existing_user_generated_fields = {};
			for(let field_name in schema_data.fields) {
				if(reserved_field_names.indexOf(field_name) == -1) {
					existing_user_generated_fields[field_name] = schema_data.fields[field_name];
				}
			}
			// now do the work to update the schema
			return Parse.Promise.resolve().then(function() {
				// first lets remove any fields that no longer existing in object, or have changed
				for(let field_name in existing_user_generated_fields) {
					if(!thisObject.field_settings[field_name]) {
						// field no longer exists
						remove_schema_field(this_schema, field_name, existing_user_generated_fields[field_name].targetClass);
						existing_user_generated_fields[field_name] = false;
					} else if(thisObject.field_settings[field_name].type != existing_user_generated_fields[field_name].type.toLowerCase()) {
						// field type has changed
						remove_schema_field(this_schema, field_name, existing_user_generated_fields[field_name].targetClass);
						existing_user_generated_fields[field_name] = false;
					} else if(((thisObject.field_settings[field_name].type == "pointer") || (thisObject.field_settings[field_name].type == "relation")) && (thisObject.field_settings[field_name].target_class != existing_user_generated_fields[field_name].targetClass))  {
						// field type hasn't changed, but target class has
						remove_schema_field(this_schema, field_name, existing_user_generated_fields[field_name].targetClass);
						existing_user_generated_fields[field_name] = false;
					}
				}
				// resave after removing any fields
				return this_schema.update({ useMasterKey : true }); 
			}).then(function() {
				// now we go through the object fields (field_settings)
				// and we add any field that aren't in the scheme
				for(let field_name in thisObject.field_settings) {
					if(!existing_user_generated_fields[field_name]) {
						add_schema_field(this_schema, field_name, thisObject.field_settings[field_name]);
					}
				}
				// resave after addign any fields
				return this_schema.update({ useMasterKey : true });
			});
		}, function() {
			// schema doesn't yet exist, so its pretty easy
			// we loop through the fields and add them, then save
			for(let field_name in thisObject.field_settings) {
				add_schema_field(this_schema, field_name, thisObject.field_settings[field_name]);
			}
			// now we save the schema
			return this_schema.save({ useMasterKey : true });
		}).then(function() {
			// next we update the class level permissions
			return update_class_permissions(thisObject.className, thisObject.class_permissions);
		});
	}
	
	// before save action
	beforeSave(request) {
		// needs to return a request object
		return request.object.default_values(request).then(function(request) {
			return request.object.required_fields(request);
		});
	}
	
	// after save action
	afterSave(request) {
		// needs to return a request object
		return Parse.Promise.resolve(request);
	}
	
	// before delete action
	beforeDelete(request) {
		// needs to return a request object
		return Parse.Promise.resolve(request);
	}
	
	// after delete action
	afterDelete(request) {
		// needs to return a request object
		return Parse.Promise.resolve(request);
	}
	
	// sets the default values
	default_values(request) {
		// let's loop through the fields and set the defaults
		for (let field in request.object.field_settings) {
			// get the field options
			const field_options = request.object.field_settings[field];
			// request object value
			const value = request.object.get(field);
			// only set the default value if the value is undefined or null
			if(value === undefined || value === null) {
				request.object.set(field, field_options.default_value);
			}
		}
		// continue
		return Parse.Promise.resolve(request);
	}
	
	// verifies required fields have values
	required_fields(request) {
		// let's go throught the fields and check for required fields
		for(let field in this.field_settings) {
			// get the field options
			const field_options = this.field_settings[field];
			// request object value
			const value = this.get(field);
			// generate error if the field doesn't pass validation
			if(field_options.required && (value === undefined || value === null || (field_options.type == 'string' && value.length == ""))) {
				return Parse.Promise.error({ message : "The field->" + field + " is required." });
			}
		}
		return Parse.Promise.resolve(request);
	}
	
	// handle errors
	handle_errors(errors) {
		// this has been updated for LocalHop's error responses
		if(Array.isArray(errors)) {
			for(var i = 0; i < errors.length; i++) {
				if(errors[i]) { 
					return errors[i].message; 
				}
			}
		} else {
			return errors.message;
		}
	}
	
}