const GrowlRepo = (postgres) => {
  // Creates a table called "growls" that has a serial id, user_id foreign key
  // (that points to which user owns this growl), the text of a growl, and the
  // timestamp it was created at
  const createGrowlTableSQL = `
    CREATE TABLE IF NOT EXISTS growls(
      id SERIAL PRIMARY KEY,
      user_id integer REFERENCES users ON DELETE CASCADE,
      text text, 
      created_at timestamptz DEFAULT NOW()
    );
  `;

  // uses createGrowlTableSQL to create the growl table
  const setupRepo = async () => {
    try {
      const client = await postgres.connect();
      await client.query(createGrowlTableSQL);
      client.release();
      console.log('Growl Table Created');
      return null;
    } catch (err) {
      return err;
    }
  };

  // SQL query to insert the growl into the growls table
  const createGrowlSQL = `
    INSERT INTO growls(text, user_id)
    VALUES($1, $2)
    RETURNING id, created_at;
  `;

  // Uses createGrowlSQL to create a new growl, and return either (growl, null)
  // or (null, error)
  const createGrowl = async (text, user_id) => {
    // BOOTCAMP
  };

  // Base SQL query to return growls from the growl table. By default this will
  // return all growls.
  const getGrowlSQL = `
    SELECT g.id, g.user_id, g.text, g.created_at, u.name FROM growls g 
    INNER JOIN users u on g.user_id = u.id
  `;

  // We take the getGrowlSQL and modify it, to narrow down the selected growls
  // to return. If there is a user_id, it only returns those user_ids. It then
  // arranges the entries in reverse order, with newest first. Afterwards, it
  // will set limits and offsets to return the data appropriate data. This
  // allows for pagination. Note that by itself, the base query returns all
  // growls ever made by everyone.
  const getGrowls = async (amount, offset, user_id) => {
    let query = getGrowlSQL;
    let count = 1;
    let values = [];
    if (user_id) {
      query += ' WHERE user_id=$' + count;
      count += 1;
      values.push(user_id);
    }
    query += ' ORDER BY g.created_at DESC';

    if (amount) {
      query += ' LIMIT $' + count;
      count += 1;
      values.push(amount);
    }

    if (offset) {
      query += ' OFFSET $' + count;
      count += 1;
      values.push(offset);
    }
    // console.log(query);

    try {
      const client = await postgres.connect();
      const res = await client.query(query, values);
      client.release();
      return [res.rows, null];
    } catch (err) {
      return [null, err];
    }
  };

  // SQL query to retrieve a growl by it's id
  const getGrowlByIDSQL = `
    SELECT id, user_id, text, created_at FROM growls WHERE id=$1;
  `;

  // Uses getGrowlByIDSQL to retrieve the growl, and return either (growl, null),
  // or (null, error)
  const getGrowlByID = async (id) => {
    const values = [id];
    try {
      const client = await postgres.connect();
      const res = await client.query(getGrowlByIDSQL, values);
      client.release();
      return [res.rows[0], null];
    } catch (err) {
      return [null, err];
    }
  };

  // SQL query to delete growl by their id
  const deleteGrowlSQL = `
    DELETE FROM growls WHERE id=$1;
  `;

  // Deletes the growl, and either returns an error if something went wrong, or
  // null
  const deleteGrowl = async (id) => {
    const values = [id];
    try {
      const client = await postgres.connect();
      await client.query(deleteGrowlSQL, values);
      client.release();
      return null;
    } catch (err) {
      return err;
    }
  };

  return {
    setupRepo,
    getGrowls,
    createGrowl,
    getGrowlByID,
    deleteGrowl,
  };
};

module.exports = {
  GrowlRepo,
};
