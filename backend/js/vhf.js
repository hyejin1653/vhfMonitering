const { gql } = require("apollo-server");
const dbWork = require("../database/dbWork");

const typeDefs = gql`
  type VHFList {
    idx: Int
    file_path: String
    start_time: String
    end_time: String
    location: String
    remote: String
    channel: String
    insert_dt: String
    vhf_dt: String
    play: String
    vhfBuffer: [Int]
  }
`;

const resolvers = {
  Query: {
    getList: async () => {
      //console.log("리스트 조회");
      //console.log(dbWork.getVHFList());
      let data = await dbWork.getVHFList();
      for (let row of data) {
        const file = require("fs").readFileSync(row.file_path);

        let data = new Uint8Array(file.buffer);
        //const blob = new Blob([data], { type: "audio/wav" });
        //const url = URL.createObjectURL(blob);
        //console.log(url);

        row.vhfBuffer = data;
      }
      return data;
    },
  },
};

module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
