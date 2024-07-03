import { gql } from "graphql-tag";

const GET_VHFLIST = gql`
  query {
    getList {
      file_path
      start_time
      end_time
      location
      remote
      channel
      insert_dt
      vhf_dt
      remote_nm
      center_nm
    }
  }
`;

export default { GET_VHFLIST };
