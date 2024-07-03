const { pool } = require("./dbConfig.js");

const dbWork = {
  getVHFList: async () => {
    const client = await pool.connect();
    try {
      let SQL = `   SELECT 	a.idx, b.name as location, c.name as remote, a.channel, a.vhf_dt, 
                            a.file_path, to_char(a.start_time, 'YYYY-MM-DD HH24:MI:SS') as start_time,
                            to_char(a.end_time, 'YYYY-MM-DD HH24:MI:SS') as end_time, 
                            to_char(a.insert_dt, 'YYYY-MM-DD HH24:MI:SS') as insert_dt,
                            '' play, '' stop
                    FROM gis.vhf_log a
                    join gis.vhf_center b on a.location = b.code
                    join gis.vhf_remote c on a.location = c.center and a.remote = c.code    `;
      const result = await client.query(SQL);
      let data = result.rows;
      return data;
    } finally {
      client.release();
    }
  },
};

module.exports = dbWork;
