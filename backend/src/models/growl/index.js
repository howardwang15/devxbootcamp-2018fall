const _ = require('lodash');
// Growl Model acts as a wrapper in front of the database storage model. The
// API's here acts as a contract between the controllers and the database. If we
// needed to switch out our database, we would not have to change our
// controllers, we can change the minimal logic here and in our repository
// storage system. By default it is postgres, but notice that none of the code
// in the GrowlModel relies on any specific database. Thus we can pass in any
// database, and allow data to be stored anywhere.
//
// Additionally, we can place validation and check logic in the GrowlModel, to
// catch bad data before trying to put it into the data store. This was not
// utilized in this model, but it could have been utilized here.
const GrowlModel = (repo) => {
  // No special modifications necessary, just pass the get request onto the
  // repository.
  const getGrowls = async (amount, offset, user_id) => {
    const [growls, err] = await repo.getGrowls(amount, offset, user_id);
    if (err) {
      return [null, err];
    }
    
    // replace all keys of name to user_name
    const size = growls.length;
    for (let i = 0; i < size; i++) {
      growls[i] = _.mapKeys(growls[i], function(value, key) {
        return key === 'name' ? 'user_name' : key;
      });
    }
    return [growls, err];
  };

  // No special modifications necessary, just pass the create request onto the
  // repository.
  const createGrowl = async (text, user_id) => {
    return repo.createGrowl(text, user_id);
  };

  // No special modifications necessary, just pass the delete request onto the
  // repository.
  const deleteGrowl = async (id, user_id) => {
    return repo.deleteGrowl(id, user_id);
  };

  return {
    getGrowls,
    createGrowl,
    deleteGrowl,
  };
};

module.exports = {
  GrowlModel,
};
